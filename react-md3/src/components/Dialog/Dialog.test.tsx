import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Dialog } from './Dialog'

describe('Dialog', () => {
  afterEach(() => {
    cleanup()
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

    const dialog = getByRole('dialog', { name: 'Aenderung speichern?' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')

    fireEvent.click(getByRole('button', { name: 'Bestaetigen' }))

    expect(onConfirm).toHaveBeenCalledTimes(1)
    expect(queryByRole('dialog', { name: 'Aenderung speichern?' })).not.toBeInTheDocument()
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

    expect(queryByRole('dialog', { name: 'Session beenden?' })).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()

    unmount()
    trigger.remove()
  })
})
