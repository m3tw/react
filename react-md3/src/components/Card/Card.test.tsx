import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi as vitest } from 'vitest'
import { Card } from './Card'

describe('Card Component', () => {
  it('renders correctly with default elevated variant', () => {
    render(
      <Card data-testid="card">
        <h3>Card Title</h3>
      </Card>
    )

    const card = screen.getByTestId('card')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('m3-card', 'm3-card--elevated')
    expect(card).not.toHaveClass('m3-card--interactive')
    expect(screen.getByText('Card Title')).toBeInTheDocument()
  })

  it('renders all variants correctly', () => {
    const { rerender } = render(<Card variant="filled" data-testid="card-variant">Content</Card>)
    expect(screen.getByTestId('card-variant')).toHaveClass('m3-card--filled')

    rerender(<Card variant="outlined" data-testid="card-variant">Content</Card>)
    expect(screen.getByTestId('card-variant')).toHaveClass('m3-card--outlined')
  })

  it('becomes interactive and clickable when interactive prop is true', () => {
    const handleAction = vitest.fn()
    render(
      <Card interactive onClick={handleAction} data-testid="card-interactive">
        Click Me
      </Card>
    )

    const card = screen.getByTestId('card-interactive')
    expect(card).toHaveClass('m3-card--interactive')
    expect(card).toHaveAttribute('role', 'button')
    expect(card).toHaveAttribute('tabIndex', '0')

    // Click triggers action
    fireEvent.click(card)
    expect(handleAction).toHaveBeenCalledTimes(1)

    // Keyboard (Enter/Space) triggers action
    fireEvent.keyDown(card, { key: 'Enter' })
    expect(handleAction).toHaveBeenCalledTimes(2)
  })

  it('becomes interactive automatically if onClick is provided', () => {
    render(<Card onClick={() => {}} data-testid="card-auto-interactive">Click Me</Card>)
    
    const card = screen.getByTestId('card-auto-interactive')
    expect(card).toHaveClass('m3-card--interactive')
    expect(card).toHaveAttribute('role', 'button')
  })
})
