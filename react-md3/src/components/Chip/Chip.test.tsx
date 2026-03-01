import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Chip } from './Chip'

describe('Chip', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a custom leading element (Avatar)', () => {
    const avatar = <span data-testid="avatar">A</span>
    render(<Chip label="User" variant="input" leadingElement={avatar} />)
    
    expect(screen.getByTestId('avatar')).toBeInTheDocument()
    const container = screen.getByRole('button', { name: 'User' }).parentElement!
    expect(container.classList.contains('m3-chip--has-leading')).toBe(true)
  })

  it('injects a default checkmark when a Filter chip is selected', () => {
    const { rerender } = render(<Chip label="Filter" variant="filter" />)
    
    let container = screen.getByRole('button', { name: 'Filter' }).parentElement!
    expect(container.classList.contains('m3-chip--has-leading')).toBe(false)
    expect(screen.queryByTestId('m3-filter-checkmark')).not.toBeInTheDocument()

    rerender(<Chip label="Filter" variant="filter" selected />)
    
    container = screen.getByRole('button', { name: 'Filter' }).parentElement!
    expect(container.classList.contains('m3-chip--has-leading')).toBe(true)
    expect(screen.getByTestId('m3-filter-checkmark')).toBeInTheDocument()
  })

  it('renders a selectable chip as standard example', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<Chip label="Filter" onClick={onClick} selected />)

    const chipButton = getByRole('button', { name: 'Filter' })
    expect(chipButton).toHaveAttribute('aria-pressed', 'true')

    fireEvent.click(chipButton)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports dismiss edge-case action when dismissible', () => {
    const onDismiss = vi.fn()
    const { getByRole } = render(<Chip dismissible label="Backend" onDismiss={onDismiss} variant="input" />)
    
    const container = getByRole('button', { name: 'Backend' }).parentElement!
    expect(container.classList.contains('m3-chip--has-trailing')).toBe(true)

    fireEvent.click(getByRole('button', { name: 'Backend entfernen' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })

  it('applies disabled state to all interactive elements', () => {
    const onClick = vi.fn()
    const onDismiss = vi.fn()

    const { getByRole } = render(
      <Chip label="Disabled" disabled dismissible onClick={onClick} onDismiss={onDismiss} />
    )

    const container = getByRole('button', { name: 'Disabled' }).parentElement!
    expect(container.classList.contains('m3-chip--disabled')).toBe(true)

    const mainBtn = getByRole('button', { name: 'Disabled' })
    const dismissBtn = getByRole('button', { name: 'Disabled entfernen' })
    
    expect(mainBtn).toBeDisabled()
    expect(dismissBtn).toBeDisabled()

    fireEvent.click(mainBtn)
    fireEvent.click(dismissBtn)

    expect(onClick).not.toHaveBeenCalled()
    expect(onDismiss).not.toHaveBeenCalled()
  })
})
