import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Carousel } from './Carousel'

describe('Carousel', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders standard items correctly with ARIA regions', () => {
    const { getByRole, getAllByRole } = render(
      <Carousel items={[<div key="1">Card 1</div>, <div key="2">Card 2</div>]} />
    )

    expect(getByRole('region', { name: 'Carousel' })).toBeInTheDocument()
    
    // Check for the list mapping structure
    const track = getByRole('list')
    expect(track).toBeInTheDocument()

    // Each item should have the slide role description based on M3 specs
    const slides = getAllByRole('listitem')
    expect(slides.length).toBe(2)
    expect(slides[0]).toHaveAttribute('aria-roledescription', 'slide')
    expect(slides[1]).toHaveAttribute('aria-label', 'Item 2 of 2')
  })

  it('triggers scroll commands on navigational clicks', () => {
    const { getByRole } = render(
      <Carousel items={[<div key="1">1</div>, <div key="2">2</div>, <div key="3">3</div>]} />
    )
    
    const track = getByRole('list')
    
    // Mock layout dimensions since JSDOM renders everything as 0x0
    Object.defineProperty(track, 'clientWidth', { value: 500, configurable: true })
    Object.defineProperty(track, 'scrollWidth', { value: 1500, configurable: true })
    
    // Trigger scroll recalculation so the 'atEnd' state becomes false
    fireEvent.scroll(track)

    const nextBtn = getByRole('button', { name: 'Next slide' })
    expect(nextBtn).toBeInTheDocument()
    expect(nextBtn).not.toBeDisabled()
    
    // Mock scrollBy on the track element
    track.scrollBy = vi.fn()
    
    fireEvent.click(nextBtn)
    expect(track.scrollBy).toHaveBeenCalled()
  })
})
