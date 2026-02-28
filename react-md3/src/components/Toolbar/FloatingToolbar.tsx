import type { ReactNode } from 'react'

import './FloatingToolbar.css'

type FloatingToolbarProps = {
  children: ReactNode
  color?: 'standard' | 'vibrant'
  orientation?: 'horizontal' | 'vertical'
  ariaLabel?: string
  className?: string
}

export function FloatingToolbar({
  children,
  color = 'standard',
  orientation = 'horizontal',
  ariaLabel = 'Toolbar',
  className,
}: FloatingToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      aria-orientation={orientation}
      className={[
        'm3-floating-toolbar',
        orientation === 'vertical' && 'm3-floating-toolbar--vertical',
        color === 'vibrant' && 'm3-floating-toolbar--vibrant',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
