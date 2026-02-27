import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { AlertDialog } from './AlertDialog'

describe('AlertDialog', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders critical alert dialog with explicit labels', () => {
    const onConfirm = vi.fn()
    const { getByRole, queryByRole } = render(
      <AlertDialog
        cancelLabel="Abbrechen"
        confirmLabel="Loeschen"
        defaultOpen
        description="Dieser Schritt kann nicht rueckgaengig gemacht werden."
        onConfirm={onConfirm}
        title="Kritischer Eingriff"
      />,
    )

    const alertDialog = getByRole('alertdialog', { name: 'Kritischer Eingriff' })
    expect(alertDialog).toHaveAttribute('aria-describedby')

    fireEvent.click(getByRole('button', { name: 'Loeschen' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(queryByRole('alertdialog', { name: 'Kritischer Eingriff' })).not.toBeInTheDocument()
  })

  it('keeps alert dialog open on escape and allows explicit cancel', () => {
    const onCancel = vi.fn()
    const trigger = document.createElement('button')
    trigger.textContent = 'AlertDialog oeffnen'
    document.body.appendChild(trigger)
    trigger.focus()

    const { getByRole, queryByRole, unmount } = render(
      <AlertDialog
        cancelLabel="Abbrechen"
        confirmLabel="Loeschen"
        defaultOpen
        description="Dieser Schritt kann nicht rueckgaengig gemacht werden."
        onCancel={onCancel}
        title="Kritischer Eingriff"
      />,
    )

    const cancelButton = getByRole('button', { name: 'Abbrechen' })
    const confirmButton = getByRole('button', { name: 'Loeschen' })
    expect(cancelButton).toHaveFocus()

    fireEvent.keyDown(cancelButton, { key: 'Tab', shiftKey: true })
    expect(confirmButton).toHaveFocus()

    fireEvent.keyDown(confirmButton, { key: 'Escape' })

    expect(getByRole('alertdialog', { name: 'Kritischer Eingriff' })).toBeInTheDocument()

    fireEvent.click(cancelButton)
    expect(onCancel).toHaveBeenCalledTimes(1)
    expect(queryByRole('alertdialog', { name: 'Kritischer Eingriff' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    unmount()
    trigger.remove()
  })
})
