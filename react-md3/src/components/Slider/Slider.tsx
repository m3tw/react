import { useId, useState } from 'react'

import './Slider.css'

type SliderProps = {
  label: string
  min?: number
  max?: number
  value?: number
  defaultValue?: number
  disabled?: boolean
  onValueChange?: (value: number) => void
}

export function Slider({
  label,
  min = 0,
  max = 100,
  value,
  defaultValue = min,
  disabled = false,
  onValueChange,
}: SliderProps) {
  const id = useId()
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue)
  const currentValue = isControlled ? value : internalValue

  const updateValue = (nextValue: number) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  return (
    <label className="m3-slider" htmlFor={id}>
      <span>{label}</span>
      <input
        disabled={disabled}
        id={id}
        max={max}
        min={min}
        onChange={(event) => updateValue(Number(event.target.value))}
        type="range"
        value={currentValue}
      />
    </label>
  )
}
