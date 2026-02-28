import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SplitButton } from './SplitButton'

describe('SplitButton', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders primary action and toggle', () => {
    const onClick = vi.fn()
    const { getByRole } = render(
      <SplitButton
        label="Save"
        onClick={onClick}
        menuItems={[{ label: 'Save as', value: 'save-as' }]}
      />,
    )

    const primaryBtn = getByRole('button', { name: 'Save' })
    expect(primaryBtn).toBeInTheDocument()
    fireEvent.click(primaryBtn)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('opens menu on toggle click and selects item', () => {
    const onMenuSelect = vi.fn()
    const { getByRole } = render(
      <SplitButton
        label="Send"
        menuItems={[
          { label: 'Schedule', value: 'schedule' },
          { label: 'Draft', value: 'draft' },
        ]}
        onMenuSelect={onMenuSelect}
      />,
    )

    const toggle = getByRole('button', { name: 'Show more options' })
    fireEvent.click(toggle)
    expect(toggle).toHaveAttribute('aria-expanded', 'true')

    const menuItem = getByRole('menuitem', { name: 'Schedule' })
    fireEvent.click(menuItem)
    expect(onMenuSelect).toHaveBeenCalledWith('schedule')
  })
})
