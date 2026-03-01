import { useState, useEffect } from 'react'
import { TimeDial } from './TimeDial'
import './TimePicker.css'

type TimePickerModalProps = {
  open: boolean
  value?: string // HH:mm format
  is24Hour?: boolean
  initialMode?: 'dial' | 'input'
  onConfirm?: (time: string) => void
  onCancel?: () => void
}

function parseTime(val?: string) {
  if (!val) {
    const d = new Date()
    return {
      hour: d.getHours(), // 0-23 locally
      minute: d.getMinutes(),
    }
  }
  const [h, m] = val.split(':').map(Number)
  return {
    hour: isNaN(h) ? 0 : h,
    minute: isNaN(m) ? 0 : m,
  }
}

function formatTime(hour: number, minute: number): string {
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`
}

export function TimePickerModal({
  open,
  value,
  is24Hour = false,
  initialMode = 'dial',
  onConfirm,
  onCancel,
}: TimePickerModalProps) {
  const [mode, setMode] = useState<'dial' | 'input'>(initialMode)
  const [dialMode, setDialMode] = useState<'hour' | 'minute'>('hour')
  
  const initialTime = parseTime(value)
  const [hour, setHour] = useState(initialTime.hour)
  const [minute, setMinute] = useState(initialTime.minute)
  
  // For AM/PM tracking when not in 24h mode
  const [isPM, setIsPM] = useState(initialTime.hour >= 12)

  // Input states strictly for keyboard
  const dHour = is24Hour ? hour : (hour % 12 === 0 ? 12 : hour % 12)
  const [inputHour, setInputHour] = useState(String(dHour).padStart(2, '0'))
  const [inputMinute, setInputMinute] = useState(String(minute).padStart(2, '0'))
  const [inputError, setInputError] = useState(false)

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      const parsed = parseTime(value)
      setHour(parsed.hour)
      setMinute(parsed.minute)
      setIsPM(parsed.hour >= 12)
      setDialMode('hour')
      setMode(initialMode)
      setInputError(false)
      
      const dh = is24Hour ? parsed.hour : (parsed.hour % 12 === 0 ? 12 : parsed.hour % 12)
      setInputHour(String(dh).padStart(2, '0'))
      setInputMinute(String(parsed.minute).padStart(2, '0'))
    }
  }, [open, value, is24Hour, initialMode])

  if (!open) return null

  // Derived 12-hour values for display in Dial mode blocks
  const displayHour = is24Hour ? hour : (hour % 12 === 0 ? 12 : hour % 12)
  const activeDisplayHour = String(displayHour).padStart(2, '0')
  const activeDisplayMinute = String(minute).padStart(2, '0')

  const handleDialHourChange = (val: number) => {
    if (is24Hour) {
      setHour(val)
    } else {
      let newHour = val === 12 ? 0 : val
      if (isPM) newHour += 12
      setHour(newHour)
    }
  }

  const handleAmPmToggle = (pm: boolean) => {
    setIsPM(pm)
    let newHour = hour
    if (pm && hour < 12) {
      newHour += 12
    } else if (!pm && hour >= 12) {
      newHour -= 12
    }
    setHour(newHour)
  }

  const handleConfirm = () => {
    if (mode === 'input') {
      const h = parseInt(inputHour, 10)
      const m = parseInt(inputMinute, 10)
      
      if (isNaN(h) || isNaN(m)) {
        setInputError(true)
        return
      }
      if (is24Hour && (h < 0 || h > 23)) { setInputError(true); return; }
      if (!is24Hour && (h < 1 || h > 12)) { setInputError(true); return; }
      if (m < 0 || m > 59) { setInputError(true); return; }

      let finalHour = h
      if (!is24Hour) {
        if (isPM && h !== 12) finalHour += 12
        if (!isPM && h === 12) finalHour = 0
      }
      onConfirm?.(formatTime(finalHour, m))
    } else {
      onConfirm?.(formatTime(hour, minute))
    }
  }

  const ariaTimeText = `${is24Hour ? hour : activeDisplayHour}:${activeDisplayMinute} ${!is24Hour ? (isPM ? 'PM' : 'AM') : ''}`

  return (
    <div className="m3-timepicker-modal__overlay">
      <div className="m3-timepicker-modal__scrim" onClick={onCancel} aria-hidden="true" />
      <div 
        className="m3-timepicker-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Select time. Current time is ${ariaTimeText}`}
      >
        <div className="m3-timepicker-modal__header-label">
           {mode === 'dial' ? 'Select time' : 'Enter time'}
        </div>

        <div className="m3-timepicker-modal__time-display">
          {mode === 'dial' ? (
            <>
              <button 
                type="button"
                className={`m3-timepicker-modal__digit ${dialMode === 'hour' ? 'm3-timepicker-modal__digit--active' : ''}`}
                onClick={() => setDialMode('hour')}
                aria-label={`Hour: ${activeDisplayHour}`}
              >
                {activeDisplayHour}
              </button>
              <div className="m3-timepicker-modal__colon">:</div>
              <button 
                type="button"
                className={`m3-timepicker-modal__digit ${dialMode === 'minute' ? 'm3-timepicker-modal__digit--active' : ''}`}
                onClick={() => setDialMode('minute')}
                aria-label={`Minute: ${activeDisplayMinute}`}
              >
                {activeDisplayMinute}
              </button>
            </>
          ) : (
            <>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={2}
                  className={`m3-timepicker-modal__keyboard-input ${inputError ? 'm3-timepicker-modal__keyboard-input--error' : ''}`}
                  value={inputHour}
                  onChange={(e) => {
                     setInputHour(e.target.value.replace(/[^0-9]/g, ''))
                     setInputError(false)
                  }}
                  aria-label="Hour input"
                  aria-invalid={inputError}
                />
                <span className="m3-timepicker-support-text">Hour</span>
              </div>
              <div className="m3-timepicker-modal__colon">:</div>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  maxLength={2}
                  className={`m3-timepicker-modal__keyboard-input ${inputError ? 'm3-timepicker-modal__keyboard-input--error' : ''}`}
                  value={inputMinute}
                  onChange={(e) => {
                     setInputMinute(e.target.value.replace(/[^0-9]/g, ''))
                     setInputError(false)
                  }}
                  aria-label="Minute input"
                  aria-invalid={inputError}
                />
                <span className="m3-timepicker-support-text">Minute</span>
              </div>
            </>
          )}

          {!is24Hour && (
            <div className="m3-timepicker-modal__ampm" role="group" aria-label="AM/PM Selector">
              <button 
                type="button" 
                className={`m3-timepicker-modal__ampm-btn ${!isPM ? 'm3-timepicker-modal__ampm-btn--active' : ''}`}
                onClick={() => handleAmPmToggle(false)}
                aria-pressed={!isPM}
              >
                AM
              </button>
              <button 
                type="button" 
                className={`m3-timepicker-modal__ampm-btn ${isPM ? 'm3-timepicker-modal__ampm-btn--active' : ''}`}
                onClick={() => handleAmPmToggle(true)}
                aria-pressed={isPM}
              >
                PM
              </button>
            </div>
          )}
        </div>

        {mode === 'dial' && (
          <div aria-live="polite" className="sr-only" style={{position: 'absolute', width: 1, height: 1, overflow: 'hidden'}}>
            {ariaTimeText}
          </div>
        )}

        <div className="m3-timepicker-modal__content-area" key={mode}>
          {mode === 'dial' ? (
            <TimeDial 
              mode={dialMode} 
              is24Hour={is24Hour} 
              value={dialMode === 'hour' ? hour : minute} 
              onChange={dialMode === 'hour' ? handleDialHourChange : setMinute}
              onModeSwitch={() => setDialMode('minute')}
            />
          ) : (
            <div style={{ height: '280px' }} /> /* Spacer for parity in absolute heights if desired, but flex allows it to collapse in M3 standard. Actually we just let it collapse */
          )}
        </div>

        <div className="m3-timepicker-modal__footer">
          <button 
            type="button"
            className="m3-timepicker-modal__mode-toggle"
            onClick={() => {
              // Sync states before switching
              if (mode === 'dial') {
                 setInputHour(activeDisplayHour)
                 setInputMinute(activeDisplayMinute)
              } else {
                 const h = parseInt(inputHour, 10)
                 const m = parseInt(inputMinute, 10)
                 if (!isNaN(h) && !isNaN(m)) {
                    let updatedH = h
                    if (!is24Hour) {
                      if (isPM && h !== 12) updatedH += 12
                      if (!isPM && h === 12) updatedH = 0
                    }
                    setHour(updatedH)
                    setMinute(m)
                 }
              }
              setMode(mode === 'dial' ? 'input' : 'dial')
            }}
            aria-label={mode === 'dial' ? 'Switch to text input' : 'Switch to dial input'}
          >
            {mode === 'dial' ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM9 10H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2z"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                 <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
              </svg>
            )}
          </button>
          
          <div className="m3-timepicker-modal__actions">
            <button type="button" className="m3-timepicker-modal__action-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="m3-timepicker-modal__action-btn" onClick={handleConfirm}>
              OK
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
