import { useId, useState } from 'react'

import { Calendar } from './Calendar'
import './DateTimePicker.css'

type DateTimePickerProps = {
  label: string
  value?: string
  defaultValue?: string
  min?: string
  max?: string
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export function DateTimePicker({
  label,
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const currentValue = isControlled ? (value ?? '') : internalValue

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }

    onValueChange?.(nextValue)
  }

  // Format YYYY-MM-DD for display
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const match = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/)
    return match ? `${match[2]} / ${match[3]} / ${match[1]}` : dateString
  }

  return (
    <div className="m3-date-time-picker-wrapper">
      <div 
        className={['m3-date-time-picker', isCalendarOpen ? 'm3-date-time-picker--focused' : ''].join(' ')} 
      >
        <span className="m3-date-time-picker__label">{label}</span>
        <button
          className="m3-date-time-picker__input-btn"
          disabled={disabled}
          id={id}
          type="button"
          onClick={() => setIsCalendarOpen(!isCalendarOpen)}
          aria-expanded={isCalendarOpen}
          aria-haspopup="dialog"
        >
          {currentValue ? formatDate(currentValue) : 'mm / dd / yyyy'}
          <svg className="m3-date-time-picker__icon" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
        </button>
      </div>
      
      {isCalendarOpen && (
        <div className="m3-date-time-picker__modal-overlay" role="dialog" aria-modal="true" aria-label={label}>
          <div className="m3-date-time-picker__scrim" onClick={() => setIsCalendarOpen(false)} aria-hidden="true" />
          <div className="m3-date-time-picker__modal-container">
            <Calendar 
              value={currentValue ? new Date(currentValue) : undefined} 
              onChange={(date) => {
                const year = date.getFullYear();
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const day = String(date.getDate()).padStart(2, '0');
                updateValue(`${year}-${month}-${day}`);
                setIsCalendarOpen(false);
              }}
              onCancel={() => setIsCalendarOpen(false)}
              minDate={min ? new Date(min) : undefined}
              maxDate={max ? new Date(max) : undefined}
            />
          </div>
        </div>
      )}
    </div>
  )
}

