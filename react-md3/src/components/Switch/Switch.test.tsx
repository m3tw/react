import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Switch } from './Switch'

describe('Switch', () => {
  afterEach(() => {
    cleanup()
  })

  it('toggles checked state and notifies callback', () => {
    const onCheckedChange = vi.fn()
    const { getByRole } = render(<Switch label="Auto-Update" onCheckedChange={onCheckedChange} />)

    const switchControl = getByRole('switch', { name: 'Auto-Update' })
    fireEvent.click(switchControl)

    expect(switchControl).toHaveAttribute('aria-checked', 'true')
    expect(onCheckedChange).toHaveBeenCalledWith(true)
  })

  it('keeps disabled edge-case switch unchanged', () => {
    const onCheckedChange = vi.fn()
    const { getByRole } = render(
      <Switch checked={false} disabled label="Read-Only" onCheckedChange={onCheckedChange} />,
    )

    const switchControl = getByRole('switch', { name: 'Read-Only' })
    fireEvent.click(switchControl)

    expect(switchControl).toHaveAttribute('aria-checked', 'false')
    expect(onCheckedChange).not.toHaveBeenCalled()
  })
})
