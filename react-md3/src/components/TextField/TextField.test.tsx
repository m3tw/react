import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { TextField } from './TextField'

describe('TextField', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a labeled textbox and supports standard input changes', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <TextField
        label="Projektname"
        onChange={onChange}
        supportingText="Name fuer interne Referenz."
      />,
    )

    const input = getByRole('textbox', { name: 'Projektname' })
    fireEvent.change(input, { target: { value: 'M3 Demo' } })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(input).toHaveValue('M3 Demo')
    expect(input).toHaveAccessibleDescription('Name fuer interne Referenz.')
  })

  it('exposes invalid state and error text for edge-case validation feedback', () => {
    const { getByRole } = render(
      <TextField label="API-Schluessel" errorText="Bitte einen gueltigen Schluessel eingeben." />,
    )

    const input = getByRole('textbox', { name: 'API-Schluessel' })
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(getByRole('alert')).toHaveTextContent('Bitte einen gueltigen Schluessel eingeben.')
  })

  it('supports disabled state for non-interactive input flows', () => {
    const { getByRole } = render(
      <TextField
        disabled
        label="Mandanten-ID"
        readOnly
        supportingText="Nicht editierbar in diesem Schritt."
        value="tenant-001"
      />,
    )

    const input = getByRole('textbox', { name: 'Mandanten-ID' })
    expect(input).toBeDisabled()
    expect(input).toHaveAccessibleDescription('Nicht editierbar in diesem Schritt.')
  })
})
