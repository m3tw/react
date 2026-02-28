import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { FullScreenDialog } from './FullScreenDialog'

describe('FullScreenDialog', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders with role dialog and accessible name from headline', () => {
    const { getByRole } = render(
      <FullScreenDialog defaultOpen headline="New Event">
        <p>Form content</p>
      </FullScreenDialog>,
    )

    const dialog = getByRole('dialog', { name: 'New Event' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('closes on X button click and calls onClose', () => {
    const onClose = vi.fn()
    const { getByRole, queryByRole } = render(
      <FullScreenDialog defaultOpen headline="Edit" onClose={onClose}>
        <p>Content</p>
      </FullScreenDialog>,
    )

    fireEvent.click(getByRole('button', { name: 'Close' }))
    act(() => { vi.advanceTimersByTime(250) })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(queryByRole('dialog', { name: 'Edit' })).not.toBeInTheDocument()
  })

  it('calls onConfirm when header action button is clicked', () => {
    const onConfirm = vi.fn()
    const { getByRole, queryByRole } = render(
      <FullScreenDialog
        confirmLabel="Save"
        defaultOpen
        headline="Create"
        onConfirm={onConfirm}
      >
        <p>Content</p>
      </FullScreenDialog>,
    )

    fireEvent.click(getByRole('button', { name: 'Save' }))
    act(() => { vi.advanceTimersByTime(250) })

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(queryByRole('dialog', { name: 'Create' })).not.toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    const { getByRole, queryByRole } = render(
      <FullScreenDialog defaultOpen headline="Settings" onClose={onClose}>
        <p>Content</p>
      </FullScreenDialog>,
    )

    const dialog = getByRole('dialog', { name: 'Settings' })
    fireEvent.keyDown(dialog, { key: 'Escape' })
    act(() => { vi.advanceTimersByTime(250) })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(queryByRole('dialog', { name: 'Settings' })).not.toBeInTheDocument()
  })

  it('renders children in content area', () => {
    const { getByText } = render(
      <FullScreenDialog defaultOpen headline="Details">
        <p>Custom child content</p>
      </FullScreenDialog>,
    )

    expect(getByText('Custom child content')).toBeInTheDocument()
  })

  it('traps focus within dialog', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Open'
    document.body.appendChild(trigger)
    trigger.focus()

    const { getByRole, unmount } = render(
      <FullScreenDialog defaultOpen headline="Focus Test">
        <p>Content</p>
      </FullScreenDialog>,
    )

    const closeButton = getByRole('button', { name: 'Close' })
    const actionButton = getByRole('button', { name: 'Speichern' })
    expect(closeButton).toHaveFocus()

    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true })
    expect(actionButton).toHaveFocus()

    fireEvent.keyDown(actionButton, { key: 'Tab' })
    expect(closeButton).toHaveFocus()

    unmount()
    trigger.remove()
  })
})
