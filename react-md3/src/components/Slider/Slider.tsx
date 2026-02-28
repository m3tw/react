import { useId, useState, useRef } from 'react'
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
  
  // Track if space is currently pressed for large jumps
  const isSpaceDown = useRef(false)

  const updateValue = (nextValue: number) => {
    // Clamp to min/max
    const clampedValue = Math.max(min, Math.min(max, nextValue))
    
    if (!isControlled) {
      setInternalValue(clampedValue)
    }

    onValueChange?.(clampedValue)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    if (e.code === 'Space') {
      isSpaceDown.current = true
      e.preventDefault() // prevent native page scroll
    }
    
    // Large step interval (e.g., 10%)
    const largeStep = Math.max(1, Math.round((max - min) * 0.1))

    // Handle Space + Arrows or Shift + Arrows 
    if (isSpaceDown.current || e.shiftKey || e.code === 'PageUp' || e.code === 'PageDown') {
      const stepValue = e.code === 'PageUp' ? largeStep : (e.code === 'PageDown' ? -largeStep : largeStep)
      if (e.code === 'ArrowRight' || e.code === 'ArrowUp' || e.code === 'PageUp') {
        e.preventDefault()
        updateValue(currentValue + stepValue)
      } else if (e.code === 'ArrowLeft' || e.code === 'ArrowDown' || e.code === 'PageDown') {
        e.preventDefault()
        updateValue(currentValue - stepValue)
      }
    }
  }

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Space') {
      isSpaceDown.current = false
    }
  }

  return (
    <div className={['m3-slider', disabled ? 'm3-slider--disabled' : ''].filter(Boolean).join(' ')}>
      <span className="m3-slider__label">{label}</span>
      <div className="m3-slider__container">
        <input
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={currentValue}
          disabled={disabled}
          id={id}
          max={max}
          min={min}
          onChange={(event) => updateValue(Number(event.target.value))}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
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
          <div className="m3-slider__value-indicator">
            {currentValue}
          </div>
          <div className="m3-slider__ripple">
            <Ripple />
          </div>
          <div className="m3-slider__thumb" />
        </div>
      </div>
    </div>
  )
}
