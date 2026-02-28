import React, { useState, useEffect, useRef } from 'react';
import './Ripple.css';

interface RippleWave {
  id: number;
  x: number;
  y: number;
  size: number;
  isFading: boolean;
}

export interface RippleProps {
  color?: string;
  className?: string;
}

export function Ripple({
  color,
  className = '',
}: RippleProps) {
  const [ripples, setRipples] = useState<RippleWave[]>([]);
  const containerRef = useRef<HTMLSpanElement>(null);
  const nextId = useRef(0);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    // Ensure parent has relative positioning so the absolute ripple container works as expected.
    // If the parent defines its own stacking context through another positioning, we leave it.
    if (window.getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative';
    }
    
    // Attaches global pointer events to let the parent trigger the ripple seamlessly
    const handlePointerDown = (e: PointerEvent) => {
      // Ignore if parent is visually or functionally disabled
      if ((parent as HTMLButtonElement).disabled || parent.getAttribute('aria-disabled') === 'true') {
        return;
      }

      const rect = parent.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      const id = nextId.current++;
      setRipples(prev => [...prev, { id, x, y, size, isFading: false }]);
      
      const fadeOut = () => {
        setRipples(prev => prev.map(r => r.id === id ? { ...r, isFading: true } : r));
        parent.removeEventListener('pointerup', fadeOut);
        parent.removeEventListener('pointerleave', fadeOut);
      };
      
      parent.addEventListener('pointerup', fadeOut);
      parent.addEventListener('pointerleave', fadeOut);
    };

    parent.addEventListener('pointerdown', handlePointerDown);

    return () => {
      parent.removeEventListener('pointerdown', handlePointerDown);
    };
  }, []);

  const handleAnimationEnd = (id: number) => {
    setRipples(prev => {
      const ripple = prev.find(r => r.id === id);
      if (ripple?.isFading) {
        return prev.filter(r => r.id !== id);
      }
      return prev;
    });
  };

  return (
    <span 
      ref={containerRef} 
      className={`m3-ripple-container ${className}`}
      style={color ? { '--md-ripple-color': color } as React.CSSProperties : undefined}
    >
      <span className="m3-state-layer" />
      {ripples.map(r => (
        <span 
          key={r.id} 
          className={`m3-ripple-wave ${r.isFading ? 'm3-ripple-fade-out' : ''}`}
          style={{
            left: r.x,
            top: r.y,
            width: r.size,
            height: r.size,
          }}
          onAnimationEnd={() => handleAnimationEnd(r.id)}
        />
      ))}
    </span>
  );
}
