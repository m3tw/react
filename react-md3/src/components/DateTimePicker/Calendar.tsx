import { useEffect, useMemo, useRef, useState } from 'react'
import { IconButton } from '../IconButton'
import { Ripple } from '../Ripple'
import './Calendar.css'

type CalendarProps = {
  value?: Date
  onChange?: (date: Date) => void
  onCancel?: () => void
  minDate?: Date
  maxDate?: Date
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const SHORT_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

/**
 * Formats a Date as e.g. "Sat, Feb 28"
 */
function formatHeadlineDate(date: Date | undefined): string {
  if (!date || isNaN(date.getTime())) return 'Select date'
  const dayName = SHORT_WEEKDAYS[date.getDay()]
  const monthName = MONTHS[date.getMonth()].substring(0, 3)
  return `${dayName}, ${monthName} ${date.getDate()}`
}

export function Calendar({ value, onChange, onCancel, minDate, maxDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [viewMode, setViewMode] = useState<'date' | 'year'>('date')
  const yearGridRef = useRef<HTMLDivElement>(null)
  
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const isSelected = (day: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth &&
      selectedDate.getFullYear() === currentYear
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth &&
      today.getFullYear() === currentYear
    )
  }

  const isDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day)
    if (minDate) {
      const min = new Date(minDate)
      min.setHours(0, 0, 0, 0)
      if (date < min) return true
    }
    if (maxDate) {
      const max = new Date(maxDate)
      max.setHours(23, 59, 59, 999)
      if (date > max) return true
    }
    return false
  }

  const handlePrevMonth = () => setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  const handleNextMonth = () => setCurrentDate(new Date(currentYear, currentMonth + 1, 1))

  const handleSelectDate = (day: number) => {
    if (isDisabled(day)) return
    const newDate = new Date(currentYear, currentMonth, day)
    setSelectedDate(newDate)
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onChange?.(selectedDate)
    }
  }

  // Scroll to current year when year view opens
  useEffect(() => {
    if (viewMode === 'year' && yearGridRef.current) {
      const selectedBtn = yearGridRef.current.querySelector('.m3-calendar__year-btn--selected')
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }
  }, [viewMode])

  // Generate grid cells
  const cells = useMemo(() => {
    const grid = []
    
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="m3-calendar__cell m3-calendar__cell--empty" />)
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day)
      const today = isToday(day)
      const disabled = isDisabled(day)
      
      grid.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={disabled}
          onClick={() => handleSelectDate(day)}
          className={[
            'm3-calendar__cell',
            'm3-calendar__day',
            selected ? 'm3-calendar__day--selected' : '',
            today && !selected ? 'm3-calendar__day--today' : '',
          ].filter(Boolean).join(' ')}
          aria-label={`${MONTHS[currentMonth]} ${day}, ${currentYear}`}
          aria-pressed={selected}
        >
          <Ripple />
          <span className="m3-calendar__day-text">{day}</span>
        </button>
      )
    }
    
    return grid
  }, [currentYear, currentMonth, daysInMonth, firstDay, selectedDate, minDate, maxDate])

  // Year range: 100 years back and 50 forward
  const startYear = currentYear - 100
  const endYear = currentYear + 50
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <div className="m3-calendar">
      {/* M3 Header */}
      <div className="m3-calendar__modal-header">
        <span className="m3-calendar__header-label">Select date</span>
        <div className="m3-calendar__header-row">
          <span className="m3-calendar__header-date">
            {formatHeadlineDate(selectedDate)}
          </span>
        </div>
      </div>

      {/* Navigation */}
      <div className="m3-calendar__nav">
        <button 
          className="m3-calendar__month-year-btn" 
          onClick={() => setViewMode(viewMode === 'date' ? 'year' : 'date')}
          aria-label="Change year"
        >
          {MONTHS[currentMonth]} {currentYear}
          <svg 
            className={`m3-calendar__dropdown-arrow ${viewMode === 'year' ? 'm3-calendar__dropdown-arrow--open' : ''}`} 
            width="18" height="18" viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M7 10l5 5 5-5z" />
          </svg>
        </button>

        {viewMode === 'date' && (
          <div className="m3-calendar__nav-arrows">
            <IconButton 
              ariaLabel="Previous month" 
              onClick={handlePrevMonth}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              } 
            />
            <IconButton 
              ariaLabel="Next month" 
              onClick={handleNextMonth}
              icon={
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              } 
            />
          </div>
        )}
      </div>

      {/* Calendar Body */}
      <div className="m3-calendar__body">
        {viewMode === 'date' && (
          <>
            <div className="m3-calendar__weekdays">
              {WEEKDAYS.map((day, idx) => (
                <div key={`weekday-${idx}`} className="m3-calendar__weekday" aria-hidden="true">
                  {day}
                </div>
              ))}
            </div>
            <div className="m3-calendar__grid">
              {cells}
            </div>
          </>
        )}

        {viewMode === 'year' && (
          <div className="m3-calendar__year-grid" ref={yearGridRef}>
            {years.map(y => (
              <button 
                key={y}
                type="button"
                className={[
                  'm3-calendar__year-btn',
                  y === currentYear ? 'm3-calendar__year-btn--selected' : '',
                  y === new Date().getFullYear() ? 'm3-calendar__year-btn--current' : '',
                ].filter(Boolean).join(' ')}
                onClick={() => {
                  setCurrentDate(new Date(y, currentMonth, 1))
                  setViewMode('date')
                }}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* M3 Action Buttons */}
      <div className="m3-calendar__actions">
        <button 
          type="button" 
          className="m3-calendar__action-btn" 
          onClick={onCancel}
        >
          Cancel
        </button>
        <button 
          type="button" 
          className="m3-calendar__action-btn m3-calendar__action-btn--confirm" 
          onClick={handleConfirm}
          disabled={!selectedDate}
        >
          OK
        </button>
      </div>
    </div>
  )
}
