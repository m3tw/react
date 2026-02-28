import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement, KeyboardEvent } from 'react'

import './PlainTooltip.css'

type PlainTooltipProps = {
  children: ReactElement
  content: string
  open?: boolean
  onOpenChange?: (open: boolean) => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const SHOW_DELAY = 500

export function PlainTooltip({
  children,
  content,
  open,
  onOpenChange,
  position = 'bottom',
}: PlainTooltipProps) {
  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled PlainTooltip erwartet onOpenChange.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isControlled ? open : internalOpen
  const showTimerRef = useRef<number | null>(null)
  const tooltipId = useId()

  const setTooltipOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const clearShowTimer = useCallback(() => {
    if (showTimerRef.current !== null) {
      window.clearTimeout(showTimerRef.current)
      showTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearShowTimer()
    }
  }, [clearShowTimer])

  const handleMouseEnter = () => {
    clearShowTimer()
    showTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(true)
      showTimerRef.current = null
    }, SHOW_DELAY)
  }

  const handleMouseLeave = () => {
    clearShowTimer()
    setTooltipOpen(false)
  }

  const handleFocus = () => {
    clearShowTimer()
    setTooltipOpen(true)
  }

  const handleBlur = () => {
    clearShowTimer()
    setTooltipOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      clearShowTimer()
      setTooltipOpen(false)
    }
  }

  return (
    <span
      className="m3-plain-tooltip-anchor"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-describedby={isOpen ? tooltipId : undefined}
    >
      {children}
      {isOpen ? (
        <span
          className={`m3-plain-tooltip m3-plain-tooltip--${position}`}
          id={tooltipId}
          role="tooltip"
        >
          {content}
        </span>
      ) : null}
    </span>
  )
}
