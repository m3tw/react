import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { DateTimePicker } from './DateTimePicker'

describe('DateTimePicker', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a date picker and emits value changes', () => {
    const onValueChange = vi.fn()
    const { getByLabelText } = render(<DateTimePicker label="Datum" mode="date" onValueChange={onValueChange} />)

    const input = getByLabelText('Datum')
    expect(input).toHaveAttribute('type', 'date')

    fireEvent.change(input, { target: { value: '2026-02-28' } })
    expect(onValueChange).toHaveBeenCalledWith('2026-02-28')
  })

  it('renders disabled time picker edge case', () => {
    const { getByLabelText } = render(<DateTimePicker disabled label="Uhrzeit" mode="time" />)

    expect(getByLabelText('Uhrzeit')).toBeDisabled()
  })

  it('prefers controlled value when value and defaultValue are both provided', () => {
    const onValueChange = vi.fn()
    const { getByLabelText, rerender } = render(
      <DateTimePicker
        defaultValue="2026-02-28T08:00"
        label="Termin"
        mode="datetime"
        onValueChange={onValueChange}
        value="2026-02-28T09:00"
      />,
    )

    const input = getByLabelText('Termin') as HTMLInputElement
    expect(input.value).toBe('2026-02-28T09:00')

    fireEvent.change(input, { target: { value: '2026-02-28T10:00' } })
    expect(onValueChange).toHaveBeenCalledWith('2026-02-28T10:00')

    rerender(
      <DateTimePicker
        defaultValue="2026-02-28T08:00"
        label="Termin"
        mode="datetime"
        onValueChange={onValueChange}
        value="2026-02-28T11:00"
      />,
    )

    expect((getByLabelText('Termin') as HTMLInputElement).value).toBe('2026-02-28T11:00')
  })
})
