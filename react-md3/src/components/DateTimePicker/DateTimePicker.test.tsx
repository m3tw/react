import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DateTimePicker } from './DateTimePicker'

describe('DateTimePicker', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a date picker button and emits value changes from calendar', () => {
    const onValueChange = vi.fn()
    const { getByRole, queryByRole } = render(<DateTimePicker label="Datum" onValueChange={onValueChange} />)

    const btn = getByRole('button', { name: /mm \/ dd \/ yyyy/i })
    expect(btn).toBeInTheDocument()

    // Calendar is closed initially
    expect(queryByRole('dialog')).not.toBeInTheDocument()

    // Open calendar
    fireEvent.click(btn)
    expect(getByRole('dialog', { name: 'Datum' })).toBeInTheDocument()

    // Select the 15th of the current month
    const dayButton = getByRole('button', { name: new RegExp(`15, ${new Date().getFullYear()}$`, 'i') })
    fireEvent.click(dayButton)

    const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
    const currentYear = new Date().getFullYear()

    expect(onValueChange).toHaveBeenCalledWith(`${currentYear}-${currentMonth}-15`)
  })

  it('renders disabled date picker edge case', () => {
    const { getByRole } = render(<DateTimePicker disabled label="Datum" />)

    const btn = getByRole('button', { name: /mm \/ dd \/ yyyy/i })
    expect(btn).toBeDisabled()
  })

  it('prefers controlled value when value and defaultValue are both provided', () => {
    const onValueChange = vi.fn()
    const { getByRole, rerender } = render(
      <DateTimePicker
        defaultValue="2026-02-14"
        label="Termin"
        onValueChange={onValueChange}
        value="2026-02-28"
      />,
    )

    // Button should display the formatted value
    const btn = getByRole('button', { name: /02 \/ 28 \/ 2026/ })
    expect(btn).toBeInTheDocument()

    rerender(
      <DateTimePicker
        defaultValue="2026-02-14"
        label="Termin"
        onValueChange={onValueChange}
        value="2026-03-10"
      />,
    )

    expect(getByRole('button', { name: /03 \/ 10 \/ 2026/ })).toBeInTheDocument()
  })
})
