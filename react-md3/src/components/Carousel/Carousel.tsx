import React, { useRef, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { IconButton } from '../IconButton';
import './Carousel.css';

export type CarouselLayout = 'multi-browse' | 'uncontained' | 'hero' | 'full-screen';

export interface CarouselProps {
  /** Array of items to display in the carousel */
  items: ReactNode[];
  /** The M3 layout mode. Defaults to 'multi-browse' */
  layout?: CarouselLayout;
  /** Accessible label for the carousel region */
  ariaLabel?: string;
  /** Hide standard navigation arrows (useful for pure touch environments) */
  hideNavigation?: boolean;
}

export function Carousel({
  items,
  layout = 'multi-browse',
  ariaLabel = 'Carousel',
  hideNavigation = false,
}: CarouselProps) {
  const scrollContainerRef = useRef<HTMLOListElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  // Handle Scroll to update arrows
  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    
    // Check if within 1px to avoid floating point rounding issues
    setAtStart(scrollLeft <= 1);
    setAtEnd(scrollLeft + clientWidth >= scrollWidth - 1);
  }, []);

  // Initialize scroll state on mount
  React.useEffect(() => {
    handleScroll();
    window.addEventListener('resize', handleScroll);
    return () => window.removeEventListener('resize', handleScroll);
  }, [handleScroll]);

  // Basic scroll helpers (Snaps to roughly the width of a standard item)
  const scrollByAmount = (direction: 'next' | 'prev') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    
    // Determine a reasonable scroll distance. usually clientWidth minus a little peek
    const scrollAmount = container.clientWidth * 0.75; 
    container.scrollBy({
      left: direction === 'next' ? scrollAmount : -scrollAmount,
      behavior: 'smooth'
    });
  };

  if (!items || items.length === 0) {
    return null;
  }

  return (
    <section 
      className={`m3-carousel m3-carousel--${layout}`}
      aria-label={ariaLabel}
      aria-roledescription="carousel"
      role="region"
    >
      <div className="m3-carousel__container">
        <ol 
          className="m3-carousel__track"
          ref={scrollContainerRef}
          onScroll={handleScroll}
        >
          {items.map((item, index) => (
            <li 
              key={index} 
              className="m3-carousel__item"
              aria-roledescription="slide"
              aria-label={`Item ${index + 1} of ${items.length}`}
            >
              {item}
            </li>
          ))}
        </ol>

        {!hideNavigation && (
          <>
            <div className={`m3-carousel__nav-control m3-carousel__nav-control--prev ${atStart ? 'is-hidden' : ''}`}>
               <IconButton 
                 ariaLabel="Previous slide"
                 variant="filled" // Often elevated or filled in M3 for visibility over images
                 onClick={() => scrollByAmount('prev')}
                 disabled={atStart}
                 icon={
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"/>
                   </svg>
                 }
               />
            </div>
            <div className={`m3-carousel__nav-control m3-carousel__nav-control--next ${atEnd ? 'is-hidden' : ''}`}>
               <IconButton 
                 ariaLabel="Next slide"
                 variant="filled"
                 onClick={() => scrollByAmount('next')}
                 disabled={atEnd}
                 icon={
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                     <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"/>
                   </svg>
                 }
               />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
