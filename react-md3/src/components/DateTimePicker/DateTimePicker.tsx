import { useId, useState } from 'react'

import './DateTimePicker.css'

type DateTimePickerMode = 'datetime' | 'date' | 'time'

type DateTimePickerProps = {
  label: string
  mode?: DateTimePickerMode
  value?: string
  defaultValue?: string
  min?: string
  max?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

const inputTypeByMode: Record<DateTimePickerMode, string> = {
  datetime: 'datetime-local',
  date: 'date',
  time: 'time',
}

export function DateTimePicker({
  label,
  mode = 'datetime',
  value,
  defaultValue,
  min,
  max,
  disabled = false,
  onValueChange,
}: DateTimePickerProps) {
  const id = useId()
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const currentValue = isControlled ? (value ?? '') : internalValue

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return (
    <label className="m3-date-time-picker" htmlFor={id}>
      <span className="m3-date-time-picker__label">{label}</span>
      <input
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onChange={(event) => updateValue(event.target.value)}
        type={inputTypeByMode[mode]}
        value={currentValue}
      />
    </label>
  )
}
