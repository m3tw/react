import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Chip } from './Chip'

describe('Chip', () => {
  afterEach(() => {
    cleanup()
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
    const { getByRole } = render(<Chip dismissible label="Backend" onDismiss={onDismiss} />)

    fireEvent.click(getByRole('button', { name: 'Backend entfernen' }))
    expect(onDismiss).toHaveBeenCalledTimes(1)
  })
})
