import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { IconButton } from './IconButton'

describe('IconButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders an icon button with selected state', () => {
    const { getByRole } = render(<IconButton ariaLabel="Favorit" selected />)

    expect(getByRole('button', { name: 'Favorit' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('prevents interaction in disabled edge case', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<IconButton ariaLabel="Disabled" disabled onClick={onClick} />)

    const button = getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
