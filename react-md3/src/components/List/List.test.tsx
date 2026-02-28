import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { List } from './List'

describe('List', () => {
  afterEach(() => {
    cleanup()
  })

  const items = [
    { label: 'Inbox', value: 'inbox' },
    { label: 'Archive', value: 'archive', disabled: true },
  ]

  it('renders a selectable list and changes active option', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(<List defaultValue="inbox" items={items} onValueChange={onValueChange} />)

    const activeItem = getByRole('option', { name: 'Inbox' })
    expect(activeItem).toHaveAttribute('aria-selected', 'true')

    fireEvent.click(activeItem)
    expect(onValueChange).toHaveBeenCalledWith('inbox')
  })

  it('keeps disabled edge-case list item non-selectable', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(<List items={items} onValueChange={onValueChange} />)

    const disabledItem = getByRole('option', { name: 'Archive' })
    expect(disabledItem).toBeDisabled()

    fireEvent.click(disabledItem)
    expect(onValueChange).not.toHaveBeenCalledWith('archive')
  })
})
