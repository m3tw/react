import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Snackbar } from './Snackbar'

describe('Snackbar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders success feedback and dismisses via close action', () => {
    const onDismiss = vi.fn()
    const { getByRole, queryByRole } = render(
      <Snackbar defaultOpen message="Aenderungen wurden gespeichert." onDismiss={onDismiss} />,
    )

    expect(getByRole('status')).toBeInTheDocument()
    fireEvent.click(getByRole('button', { name: 'Schliessen' }))

    expect(onDismiss).toHaveBeenCalledTimes(1)
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('supports error retry action and rejects invalid action config', () => {
    const onAction = vi.fn()
    const { getByRole, queryByRole } = render(
      <Snackbar
        actionLabel="Erneut versuchen"
        defaultOpen
        message="Upload fehlgeschlagen."
        onAction={onAction}
        tone="error"
      />,
    )

    const alert = getByRole('alert')
    expect(alert).toHaveAttribute('aria-live', 'assertive')

    fireEvent.click(getByRole('button', { name: 'Erneut versuchen' }))
    expect(onAction).toHaveBeenCalledTimes(1)
    expect(queryByRole('alert')).not.toBeInTheDocument()

    expect(() =>
      render(<Snackbar actionLabel="Ohne Callback" defaultOpen message="Invalides Muster" />),
    ).toThrow('actionLabel und onAction')
  })
})
