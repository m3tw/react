import { useMemo, useState } from 'react'
import { IconButton } from '../IconButton'
import { Ripple } from '../Ripple'
import './Calendar.css'

type CalendarProps = {
  value?: Date
  onChange?: (date: Date) => void
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

export function Calendar({ value, onChange, minDate, maxDate }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(value || new Date())
  
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()

  const daysInMonth = getDaysInMonth(currentYear, currentMonth)
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth)

  const isSelected = (day: number) => {
    if (!value) return false
    return (
      value.getDate() === day &&
      value.getMonth() === currentMonth &&
      value.getFullYear() === currentYear
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
    if (minDate && date < new Date(minDate.setHours(0, 0, 0, 0))) return true
    if (maxDate && date > new Date(maxDate.setHours(23, 59, 59, 999))) return true
    return false
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1))
  }

  const handleSelectDate = (day: number) => {
    if (isDisabled(day)) return
    const newDate = new Date(currentYear, currentMonth, day)
    onChange?.(newDate)
  }

  // Generate grid cells (empty cells for offset + days of month)
  const cells = useMemo(() => {
    const grid = []
    
    // Empty cells before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
      grid.push(<div key={`empty-${i}`} className="m3-calendar__cell m3-calendar__cell--empty" />)
    }
    
    // Actual days
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
  }, [currentYear, currentMonth, daysInMonth, firstDay, value, minDate, maxDate])

  return (
    <div className="m3-calendar">
      <div className="m3-calendar__header">
        <IconButton 
          ariaLabel="Previous month" 
          onClick={handlePrevMonth}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          } 
        />
        <div className="m3-calendar__title" aria-live="polite">
          {MONTHS[currentMonth]} {currentYear}
        </div>
        <IconButton 
          ariaLabel="Next month" 
          onClick={handleNextMonth}
          icon={
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          } 
        />
      </div>
      
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
    </div>
  )
}
