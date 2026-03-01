import { useId, useState } from 'react'
import { TimePickerModal } from './TimePickerModal'
import './TimePicker.css'

export type TimePickerProps = {
  label: string
  value?: string // HH:mm format
  defaultValue?: string
  is24Hour?: boolean
  disabled?: boolean
  onValueChange?: (value: string) => void
}

export function TimePicker({
  label,
  value,
  defaultValue,
  is24Hour = false,
  disabled = false,
  onValueChange,
}: TimePickerProps) {
  const id = useId()
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(defaultValue ?? '')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const currentValue = isControlled ? (value ?? '') : internalValue

  const updateValue = (nextValue: string) => {
    if (!isControlled) {
      setInternalValue(nextValue)
    }
    onValueChange?.(nextValue)
  }

  // Format HH:MM to 12h or 24h for the input surface display
  const formatTime = (timeStr: string) => {
    if (!timeStr) return '--:--'
    const [hStr, mStr] = timeStr.split(':')
    const h = parseInt(hStr, 10)
    if (isNaN(h)) return timeStr

    if (is24Hour) {
      return `${String(h).padStart(2, '0')}:${mStr}`
    } else {
      const pm = h >= 12
      let hour12 = h % 12
      if (hour12 === 0) hour12 = 12
      return `${hour12}:${mStr} ${pm ? 'PM' : 'AM'}`
    }
  }

  return (
    <div className="m3-time-picker-wrapper">
      <div 
        className={['m3-time-picker', isModalOpen ? 'm3-time-picker--focused' : ''].join(' ')} 
      >
        <span className="m3-time-picker__label">{label}</span>
        <button
          className="m3-time-picker__input-btn"
          disabled={disabled}
          id={id}
          type="button"
          onClick={() => setIsModalOpen(true)}
          aria-expanded={isModalOpen}
          aria-haspopup="dialog"
          aria-label={currentValue ? `Time selected: ${formatTime(currentValue)}` : `Select time. ${label}`}
        >
          {currentValue ? formatTime(currentValue) : '--:--'}
          <svg className="m3-time-picker__icon" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
          </svg>
        </button>
      </div>
      
      <TimePickerModal 
        open={isModalOpen}
        value={currentValue}
        is24Hour={is24Hour}
        onConfirm={(val) => {
           updateValue(val)
           setIsModalOpen(false)
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    </div>
  )
}
