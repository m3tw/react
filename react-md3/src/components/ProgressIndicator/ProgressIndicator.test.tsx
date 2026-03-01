import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, it, expect } from 'vitest'

import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders linear determinate progress bar by default', () => {
    render(<ProgressIndicator value={45} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '45')
    
    // Check root class and element
    expect(progressBar).toHaveClass('m3-progress-indicator--linear')
    // Check fill element style width mapping
    const track = progressBar.querySelector('.m3-progress-indicator__fill--linear')
    expect(track).toHaveStyle({ width: '45%' })
  })

  it('renders circular determinate indicator with proper stroke math', () => {
    render(<ProgressIndicator variant="circular" value={75} />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).toBeInTheDocument()
    expect(progressBar).toHaveAttribute('aria-valuenow', '75')
    
    expect(progressBar).toHaveClass('m3-progress-indicator--circular')
    const circleFill = progressBar.querySelector('.m3-progress-indicator__circle-fill')
    expect(circleFill).toBeInTheDocument()
    
    // Ensure clamp logic functions naturally
    cleanup() // Clear previous render
    render(<ProgressIndicator variant="circular" value={150} />)
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders linear indeterminate and strips values', () => {
    render(<ProgressIndicator variant="linear" indeterminate />)
    const progressBar = screen.getByRole('progressbar')
    expect(progressBar).not.toHaveAttribute('aria-valuenow')
    expect(progressBar).toHaveAttribute('aria-valuetext', 'Ladevorgang')
    
    const fill = progressBar.querySelector('.m3-progress-indicator__fill--linear-indeterminate')
    expect(fill).toBeInTheDocument()
    // It should not have a static inline style width
    expect(fill).not.toHaveStyle({ width: '0%' }) 
  })

  it('renders circular indeterminate as a loading status overlay', () => {
    render(<ProgressIndicator variant="circular" indeterminate />)
    // The spec states indeterminate circles act natively as loaders
    const status = screen.getByRole('status')
    expect(status).toHaveAttribute('aria-live', 'polite')
    expect(status).toHaveClass('m3-progress-indicator--circular')
    expect(status.querySelector('.m3-progress-indicator__circle-fill--indeterminate')).toBeInTheDocument()
  })
})
