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

  it('renders correctly with primary and secondary variants', () => {
    const { getByRole, rerender } = render(<Tabs tabs={tabs} variant="primary" />)
    expect(getByRole('tablist')).toHaveClass('m3-tabs--primary')

    rerender(<Tabs tabs={tabs} variant="secondary" />)
    expect(getByRole('tablist')).toHaveClass('m3-tabs--secondary')
  })

  it('renders correctly with fixed and scrollable layouts', () => {
    const { getByRole, rerender } = render(<Tabs tabs={tabs} layout="fixed" />)
    expect(getByRole('tablist')).toHaveClass('m3-tabs--fixed')

    rerender(<Tabs tabs={tabs} layout="scrollable" />)
    expect(getByRole('tablist')).toHaveClass('m3-tabs--scrollable')
  })

  it('renders icons when provided', () => {
    const tabsWithIcons = [
      { label: 'Video', value: 'video', icon: <span data-testid="icon">V</span> },
      { label: 'Audio', value: 'audio' }
    ]
    const { getByTestId } = render(<Tabs tabs={tabsWithIcons} />)
    expect(getByTestId('icon')).toBeInTheDocument()
  })

  it('handles arrow key navigation', () => {
    const { getByRole } = render(<Tabs tabs={tabs} defaultValue="overview" />)
    const tablist = getByRole('tablist')
    
    // Overview is currently selected/active. Focus is managed by the user traditionally,
    // but the component intercepts keydown on the tablist
    fireEvent.keyDown(tablist, { key: 'ArrowRight' })
    expect(getByRole('tab', { name: 'Details' })).toHaveFocus()
    
    // Test wrap around or skips
    fireEvent.keyDown(tablist, { key: 'End' })
    // Focus should move to Details (Blocked is disabled)
    expect(getByRole('tab', { name: 'Details' })).toHaveFocus()
    
    fireEvent.keyDown(tablist, { key: 'Home' })
    expect(getByRole('tab', { name: 'Overview' })).toHaveFocus()
  })
})
