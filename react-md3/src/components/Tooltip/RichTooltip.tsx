import { useCallback, useEffect, useId, useRef, useState } from 'react'
import type { ReactElement, KeyboardEvent } from 'react'
import { Button } from '../Button'

import './RichTooltip.css'

type RichTooltipProps = {
  children: ReactElement
  supportingText: string
  subhead?: string
  actionLabel?: string
  onAction?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const SHOW_DELAY = 500
const HIDE_GRACE_PERIOD = 1500

export function RichTooltip({
  children,
  supportingText,
  subhead,
  actionLabel,
  onAction,
  open,
  onOpenChange,
  position = 'bottom',
}: RichTooltipProps) {
  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled RichTooltip erwartet onOpenChange.')
  }

  if ((actionLabel && !onAction) || (!actionLabel && onAction)) {
    throw new Error('RichTooltip erwartet actionLabel und onAction gemeinsam.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(false)
  const isOpen = isControlled ? open : internalOpen
  const showTimerRef = useRef<number | null>(null)
  const hideTimerRef = useRef<number | null>(null)
  const tooltipId = useId()
  const subheadId = useId()
  const supportingTextId = useId()

  const hasActions = Boolean(actionLabel)
  const role = hasActions ? 'dialog' : 'tooltip'

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

  const clearHideTimer = useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
      hideTimerRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      clearShowTimer()
      clearHideTimer()
    }
  }, [clearShowTimer, clearHideTimer])

  const handleAnchorMouseEnter = () => {
    clearHideTimer()
    clearShowTimer()
    showTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(true)
      showTimerRef.current = null
    }, SHOW_DELAY)
  }

  const handleAnchorMouseLeave = () => {
    clearShowTimer()
    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(false)
      hideTimerRef.current = null
    }, HIDE_GRACE_PERIOD)
  }

  const handleTooltipMouseEnter = () => {
    clearHideTimer()
  }

  const handleTooltipMouseLeave = () => {
    clearHideTimer()
    hideTimerRef.current = window.setTimeout(() => {
      setTooltipOpen(false)
      hideTimerRef.current = null
    }, HIDE_GRACE_PERIOD)
  }

  const handleFocus = () => {
    clearShowTimer()
    clearHideTimer()
    setTooltipOpen(true)
  }

  const handleBlur = () => {
    clearShowTimer()
    clearHideTimer()
    setTooltipOpen(false)
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape' && isOpen) {
      event.preventDefault()
      clearShowTimer()
      clearHideTimer()
      setTooltipOpen(false)
    }
  }

  const ariaProps = hasActions
    ? {
        role: role as 'dialog',
        'aria-labelledby': subhead ? subheadId : undefined,
        'aria-describedby': supportingTextId,
      }
    : {
        role: role as 'tooltip',
        id: tooltipId,
      }

  return (
    <span
      className="m3-rich-tooltip-anchor"
      onMouseEnter={handleAnchorMouseEnter}
      onMouseLeave={handleAnchorMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      aria-describedby={isOpen && !hasActions ? tooltipId : undefined}
    >
      {children}
      {isOpen ? (
        <div
          className={[
            'm3-rich-tooltip',
            `m3-rich-tooltip--${position}`,
            hasActions ? 'm3-rich-tooltip--with-actions' : 'm3-rich-tooltip--without-actions',
          ].join(' ')}
          onMouseEnter={handleTooltipMouseEnter}
          onMouseLeave={handleTooltipMouseLeave}
          {...ariaProps}
        >
          {subhead ? (
            <p className="m3-rich-tooltip__subhead" id={subheadId}>
              {subhead}
            </p>
          ) : null}
          <p className="m3-rich-tooltip__supporting-text" id={supportingTextId}>
            {supportingText}
          </p>
          {hasActions ? (
            <div className="m3-rich-tooltip__actions">
              <Button variant="text" onClick={onAction}>
                {actionLabel}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </span>
  )
}
