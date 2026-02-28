import { useEffect, useRef, useState } from 'react'
import { Ripple } from '../Ripple'
import './Calendar.css'

type CalendarProps = {
  value?: Date
  onChange?: (date: Date) => void
  onCancel?: () => void
  onSelect?: (date: Date) => void
  minDate?: Date
  maxDate?: Date
  hideActions?: boolean
}

const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()
const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay()

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export function Calendar({ value, onChange, onCancel, onSelect, minDate, maxDate, hideActions = false }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(value)
  const [showMonthMenu, setShowMonthMenu] = useState(false)
  const [showYearMenu, setShowYearMenu] = useState(false)
  const yearGridRef = useRef<HTMLDivElement>(null)
  
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  // Previous month trailing days
  const prevMonthDays = getDaysInMonth(
    currentMonth === 0 ? currentYear - 1 : currentYear,
    currentMonth === 0 ? 11 : currentMonth - 1
  )

  const isSelected = (day: number, month: number, year: number) => {
    if (!selectedDate) return false
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === year
    )
  }

  const isToday = (day: number, month: number, year: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === month &&
      today.getFullYear() === year
    )
  }

  const isDisabled = (day: number, month: number, year: number) => {
    const date = new Date(year, month, day)
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
  const handlePrevYear = () => setCurrentDate(new Date(currentYear - 1, currentMonth, 1))
  const handleNextYear = () => setCurrentDate(new Date(currentYear + 1, currentMonth, 1))

  const handleSelectDate = (day: number, month: number, year: number) => {
    if (isDisabled(day, month, year)) return
    const newDate = new Date(year, month, day)
    setSelectedDate(newDate)
    onSelect?.(newDate)
    // Navigate to that month if it's a trailing day
    if (month !== currentMonth || year !== currentYear) {
      setCurrentDate(new Date(year, month, 1))
    }
  }

  const handleConfirm = () => {
    if (selectedDate) {
      onChange?.(selectedDate)
    }
  }

  // Close menus when clicking outside
  const handleCloseMenus = () => {
    setShowMonthMenu(false)
    setShowYearMenu(false)
  }

  // Scroll to current year when year menu opens
  useEffect(() => {
    if (showYearMenu && yearGridRef.current) {
      const selectedBtn = yearGridRef.current.querySelector('.m3-calendar__year-option--selected')
      if (selectedBtn) {
        selectedBtn.scrollIntoView({ block: 'center', behavior: 'instant' })
      }
    }
  }, [showYearMenu])

  // Generate grid cells including trailing days
  const cells = (() => {
    const grid = []
    
    // Previous month trailing days
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i
      const month = currentMonth === 0 ? 11 : currentMonth - 1
      const year = currentMonth === 0 ? currentYear - 1 : currentYear

      grid.push(
        <button
          key={`prev-${day}`}
          type="button"
          onClick={() => handleSelectDate(day, month, year)}
          className={[
            'm3-calendar__cell',
            'm3-calendar__day',
            'm3-calendar__day--outside',
            isSelected(day, month, year) ? 'm3-calendar__day--selected' : '',
          ].filter(Boolean).join(' ')}
          aria-label={`${MONTHS[month]} ${day}, ${year}`}
        >
          <Ripple />
          <span className="m3-calendar__day-text">{day}</span>
        </button>
      )
    }
    
    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const selected = isSelected(day, currentMonth, currentYear)
      const today = isToday(day, currentMonth, currentYear)
      const disabled = isDisabled(day, currentMonth, currentYear)
      
      grid.push(
        <button
          key={`day-${day}`}
          type="button"
          disabled={disabled}
          onClick={() => handleSelectDate(day, currentMonth, currentYear)}
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

    // Next month trailing days (fill out to 6 rows = 42 cells)
    const totalCells = grid.length
    const remaining = 42 - totalCells
    for (let i = 1; i <= remaining; i++) {
      const month = currentMonth === 11 ? 0 : currentMonth + 1
      const year = currentMonth === 11 ? currentYear + 1 : currentYear

      grid.push(
        <button
          key={`next-${i}`}
          type="button"
          onClick={() => handleSelectDate(i, month, year)}
          className={[
            'm3-calendar__cell',
            'm3-calendar__day',
            'm3-calendar__day--outside',
            isSelected(i, month, year) ? 'm3-calendar__day--selected' : '',
          ].filter(Boolean).join(' ')}
          aria-label={`${MONTHS[month]} ${i}, ${year}`}
        >
          <Ripple />
          <span className="m3-calendar__day-text">{i}</span>
        </button>
      )
    }
    
    return grid
  })()

  // Year range
  const startYear = currentYear - 100
  const endYear = currentYear + 50
  const years = Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i)

  return (
    <div className="m3-calendar" onClick={handleCloseMenus}>
      {/* M3 Nav: < Month ▼ >   < Year ▼ > */}
      <div className="m3-calendar__nav" onClick={(e) => e.stopPropagation()}>
        {/* Month navigation */}
        <div className="m3-calendar__nav-group">
          <button 
            type="button" 
            className="m3-calendar__arrow-btn" 
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <div className="m3-calendar__dropdown-wrapper">
            <button 
              type="button"
              className="m3-calendar__dropdown-btn"
              onClick={() => { setShowMonthMenu(!showMonthMenu); setShowYearMenu(false) }}
              aria-expanded={showMonthMenu}
              aria-haspopup="listbox"
            >
              {SHORT_MONTHS[currentMonth]}
              <svg className={`m3-calendar__caret ${showMonthMenu ? 'm3-calendar__caret--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {showMonthMenu && (
              <div className="m3-calendar__dropdown-menu" role="listbox" aria-label="Select month">
                {SHORT_MONTHS.map((m, idx) => (
                  <button
                    key={m}
                    type="button"
                    role="option"
                    aria-selected={idx === currentMonth}
                    className={`m3-calendar__dropdown-option ${idx === currentMonth ? 'm3-calendar__dropdown-option--selected' : ''}`}
                    onClick={() => {
                      setCurrentDate(new Date(currentYear, idx, 1))
                      setShowMonthMenu(false)
                    }}
                  >
                    {m}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            type="button" 
            className="m3-calendar__arrow-btn" 
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>

        {/* Year navigation */}
        <div className="m3-calendar__nav-group">
          <button 
            type="button" 
            className="m3-calendar__arrow-btn" 
            onClick={handlePrevYear}
            aria-label="Previous year"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
          </button>
          <div className="m3-calendar__dropdown-wrapper">
            <button 
              type="button"
              className="m3-calendar__dropdown-btn"
              onClick={() => { setShowYearMenu(!showYearMenu); setShowMonthMenu(false) }}
              aria-expanded={showYearMenu}
              aria-haspopup="listbox"
            >
              {currentYear}
              <svg className={`m3-calendar__caret ${showYearMenu ? 'm3-calendar__caret--open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 10l5 5 5-5z"/>
              </svg>
            </button>
            {showYearMenu && (
              <div className="m3-calendar__dropdown-menu m3-calendar__dropdown-menu--year" role="listbox" aria-label="Select year" ref={yearGridRef}>
                {years.map(y => (
                  <button
                    key={y}
                    type="button"
                    role="option"
                    aria-selected={y === currentYear}
                    className={`m3-calendar__year-option ${y === currentYear ? 'm3-calendar__year-option--selected' : ''}`}
                    onClick={() => {
                      setCurrentDate(new Date(y, currentMonth, 1))
                      setShowYearMenu(false)
                    }}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            type="button" 
            className="m3-calendar__arrow-btn" 
            onClick={handleNextYear}
            aria-label="Next year"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>
          </button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="m3-calendar__weekdays">
        {WEEKDAYS.map((day, idx) => (
          <div key={`weekday-${idx}`} className="m3-calendar__weekday" aria-hidden="true">
            {day}
          </div>
        ))}
      </div>

      {/* Day Grid */}
      <div className="m3-calendar__grid">
        {cells}
      </div>

      {/* M3 Action Buttons */}
      {!hideActions && (
        <div className="m3-calendar__actions">
          <button type="button" className="m3-calendar__action-btn" onClick={onCancel}>
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
      )}
    </div>
  )
}
