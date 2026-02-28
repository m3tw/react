import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Tabs } from './Tabs'

describe('Tabs', () => {
  afterEach(() => {
    cleanup()
  })

  const tabs = [
    { label: 'Overview', value: 'overview' },
    { label: 'Details', value: 'details' },
    { label: 'Blocked', value: 'blocked', disabled: true },
  ]

  it('renders tabs and marks selected tab', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(<Tabs defaultValue="overview" onValueChange={onValueChange} tabs={tabs} />)

    fireEvent.click(getByRole('tab', { name: 'Details' }))

    expect(onValueChange).toHaveBeenCalledWith('details')
    expect(getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true')
  })

  it('skips disabled edge-case tabs', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(<Tabs onValueChange={onValueChange} tabs={tabs} />)

    const blockedTab = getByRole('tab', { name: 'Blocked' })
    expect(blockedTab).toBeDisabled()

    fireEvent.click(blockedTab)
    expect(onValueChange).not.toHaveBeenCalledWith('blocked')
  })
})
