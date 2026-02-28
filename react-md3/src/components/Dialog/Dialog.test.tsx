import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders modal dialog and confirms action', () => {
    const onConfirm = vi.fn()
    const { getByRole, queryByRole } = render(
      <Dialog
        defaultOpen
        description="Aenderungen werden sofort veroeffentlicht."
        onConfirm={onConfirm}
        title="Aenderung speichern?"
      />,
    )

    const dialog = getByRole('alertdialog', { name: 'Aenderung speichern?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    fireEvent.click(getByRole('button', { name: 'Bestaetigen' }))
    act(() => { vi.advanceTimersByTime(100) })

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(queryByRole('alertdialog', { name: 'Aenderung speichern?' })).not.toBeInTheDocument()
  })

  it('traps focus, closes on escape and restores trigger focus', () => {
    const trigger = document.createElement('button')
    trigger.textContent = 'Dialog oeffnen'
    document.body.appendChild(trigger)
    trigger.focus()

    const { getByRole, queryByRole, unmount } = render(
      <Dialog
        defaultOpen
        description="Ungespeicherte Aenderungen gehen verloren."
        title="Session beenden?"
      />,
    )

    const cancelButton = getByRole('button', { name: 'Abbrechen' })
    const confirmButton = getByRole('button', { name: 'Bestaetigen' })
    expect(cancelButton).toHaveFocus()

    fireEvent.keyDown(cancelButton, { key: 'Tab', shiftKey: true })
    expect(confirmButton).toHaveFocus()

    fireEvent.keyDown(confirmButton, { key: 'Escape' })
    act(() => { vi.advanceTimersByTime(100) })

    expect(queryByRole('alertdialog', { name: 'Session beenden?' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    unmount()
    trigger.remove()
  })

  it('renders optional icon and applies center alignment class', () => {
    const icon = <svg data-testid="dialog-icon" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" /></svg>
    const { getByRole, getByTestId } = render(
      <Dialog
        defaultOpen
        icon={icon}
        title="With Icon"
      />,
    )

    const dialog = getByRole('alertdialog', { name: 'With Icon' })
    expect(dialog.classList.contains('m3-dialog--with-icon')).toBe(true)
    expect(getByTestId('dialog-icon')).toBeInTheDocument()
  })

  it('renders divider when divider prop is true', () => {
    const { container } = render(
      <Dialog
        defaultOpen
        divider
        title="With Divider"
      />,
    )

    expect(container.ownerDocument.querySelector('.m3-dialog__divider')).toBeInTheDocument()
  })

  it('renders in a portal attached to document.body', () => {
    const { getByRole } = render(
      <Dialog
        defaultOpen
        title="Portal Test"
      />,
    )

    const dialog = getByRole('alertdialog', { name: 'Portal Test' })
    expect(document.body.contains(dialog)).toBe(true)
  })
})
