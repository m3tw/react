import { useState } from 'react'
import { Calendar } from './Calendar'
import './DatePickerModal.css'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

type DatePickerModalProps = {
  open: boolean
  value?: Date
  onConfirm?: (date: Date) => void
  onCancel?: () => void
  minDate?: Date
  maxDate?: Date
  /** Start in 'calendar' or 'input' mode */
  initialMode?: 'calendar' | 'input'
}

function formatHeadlineDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return 'Select date'
  const dayName = SHORT_WEEKDAYS[date.getDay()]
  const monthName = MONTHS[date.getMonth()].substring(0, 3)
  return `${dayName}, ${monthName} ${date.getDate()}`
}

function formatInputValue(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return ''
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const y = date.getFullYear()
  return `${m}/${d}/${y}`
}

function parseInputDate(input: string): Date | null {
  // Accept MM/DD/YYYY
  const match = input.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (!match) return null
  const month = parseInt(match[1], 10) - 1
  const day = parseInt(match[2], 10)
  const year = parseInt(match[3], 10)
  const date = new Date(year, month, day)
  if (date.getMonth() !== month || date.getDate() !== day) return null
  return date
}

export function DatePickerModal({
  open,
  value,
  onConfirm,
  onCancel,
  minDate,
  maxDate,
  initialMode = 'calendar',
}: DatePickerModalProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [mode, setMode] = useState<'calendar' | 'input'>(initialMode)
  const [inputValue, setInputValue] = useState(formatInputValue(value))
  const [inputError, setInputError] = useState(false)

  if (!open) return null

  const handleCalendarSelect = (date: Date) => {
    setSelectedDate(date)
    setInputValue(formatInputValue(date))
    setInputError(false)
  }

  const handleInputChange = (val: string) => {
    setInputValue(val)
    const parsed = parseInputDate(val)
    if (parsed) {
      setSelectedDate(parsed)
      setInputError(false)
    } else if (val.length > 0) {
      setInputError(true)
    }
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onConfirm?.(selectedDate)
    }
  }

  const toggleMode = () => {
    if (mode === 'calendar') {
      setInputValue(formatInputValue(selectedDate))
      setMode('input')
    } else {
      setMode('calendar')
    }
  }

  return (
    <div className="m3-datepicker-modal__overlay">
      <div className="m3-datepicker-modal__scrim" onClick={onCancel} aria-hidden="true" />
      <div className="m3-datepicker-modal" role="dialog" aria-modal="true" aria-label="Select date">
        {/* Header */}
        <div className="m3-datepicker-modal__header">
          <span className="m3-datepicker-modal__header-label">Select date</span>
          <div className="m3-datepicker-modal__header-row">
            <span className="m3-datepicker-modal__header-date">
              {formatHeadlineDate(selectedDate)}
            </span>
            <button 
              type="button" 
              className="m3-datepicker-modal__mode-btn"
              onClick={toggleMode}
              aria-label={mode === 'calendar' ? 'Switch to keyboard input' : 'Switch to calendar'}
            >
              {mode === 'calendar' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="m3-datepicker-modal__divider" />

        {/* Body */}
        {mode === 'calendar' ? (
          <div className="m3-datepicker-modal__calendar-body">
            <Calendar
              value={selectedDate}
              onSelect={handleCalendarSelect}
              minDate={minDate}
              maxDate={maxDate}
              hideActions
            />
            {/* Modal-level actions for calendar mode */}
            <div className="m3-datepicker-modal__actions">
              <button type="button" className="m3-datepicker-modal__action-btn" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="m3-datepicker-modal__action-btn m3-datepicker-modal__action-btn--confirm"
                onClick={handleConfirm}
                disabled={!selectedDate}
              >
                OK
              </button>
            </div>
          </div>
        ) : (
          <div className="m3-datepicker-modal__input-body">
            <div className="m3-datepicker-modal__input-field">
              <label className="m3-datepicker-modal__input-label" htmlFor="date-input">
                Date
              </label>
              <input
                id="date-input"
                type="text"
                className={`m3-datepicker-modal__input ${inputError ? 'm3-datepicker-modal__input--error' : ''}`}
                placeholder="MM/DD/YYYY"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                autoFocus
              />
              <span className="m3-datepicker-modal__input-supporting">
                {inputError ? 'Invalid date format' : 'MM/DD/YYYY'}
              </span>
            </div>

            {/* Action buttons for input mode */}
            <div className="m3-datepicker-modal__actions">
              <button type="button" className="m3-datepicker-modal__action-btn" onClick={onCancel}>
                Cancel
              </button>
              <button
                type="button"
                className="m3-datepicker-modal__action-btn m3-datepicker-modal__action-btn--confirm"
                onClick={handleConfirm}
                disabled={!selectedDate || inputError}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
