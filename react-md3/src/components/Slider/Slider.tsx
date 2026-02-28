import { useId, useState } from 'react'
import { Ripple } from "../Ripple";

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
    <div className={['m3-slider', disabled ? 'm3-slider--disabled' : ''].filter(Boolean).join(' ')}>
      <span className="m3-slider__label">{label}</span>
      <div className="m3-slider__container">
        <input
          aria-label={label}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          onChange={(event) => updateValue(Number(event.target.value))}
          type="range"
          value={currentValue}
          className="m3-slider__input"
        />
        <div className="m3-slider__track-container">
          <div className="m3-slider__track" />
          <div 
            className="m3-slider__track--active" 
            style={{ width: `${((currentValue - min) / (max - min)) * 100}%` }} 
          />
        </div>
        <div 
          className="m3-slider__thumb-container"
          style={{ left: `${((currentValue - min) / (max - min)) * 100}%` }}
        >
          <div className="m3-slider__ripple">
            <Ripple />
          </div>
          <div className="m3-slider__thumb" />
        </div>
      </div>
    </div>
  )
}
