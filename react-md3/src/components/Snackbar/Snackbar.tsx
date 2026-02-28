import { useCallback, useEffect, useState } from 'react'

import './Snackbar.css'

type SnackbarTone = 'success' | 'warning' | 'error'

type SnackbarProps = {
  message: string
  tone?: SnackbarTone
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  actionLabel?: string
  onAction?: () => void
  dismissLabel?: string
  onDismiss?: () => void
  autoHideDuration?: number
  ariaLabel?: string
}

export function Snackbar({
  message,
  tone = 'success',
  open,
  defaultOpen = false,
  onOpenChange,
  actionLabel,
  onAction,
  dismissLabel = 'Schliessen',
  onDismiss,
  autoHideDuration = 4000,
  ariaLabel = 'Statusmeldung',
}: SnackbarProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('Snackbar erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled Snackbar erwartet onOpenChange.')
  }

  if ((actionLabel && !onAction) || (!actionLabel && onAction)) {
    throw new Error('Snackbar erwartet actionLabel und onAction gemeinsam.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen

  const setSnackbarOpen = useCallback(
    (nextOpen: boolean) => {
      if (!isControlled) {
        setInternalOpen(nextOpen)
      }
      onOpenChange?.(nextOpen)
    },
    [isControlled, onOpenChange],
  )

  const closeSnackbar = useCallback(() => {
    onDismiss?.()
    setSnackbarOpen(false)
  }, [onDismiss, setSnackbarOpen])

  const handleAction = useCallback(() => {
    onAction?.()
    setSnackbarOpen(false)
  }, [onAction, setSnackbarOpen])

  useEffect(() => {
    if (!isOpen || autoHideDuration <= 0) {
      return
    }

    const timeout = window.setTimeout(() => {
      closeSnackbar()
    }, autoHideDuration)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [autoHideDuration, closeSnackbar, isOpen, message, tone])

  if (!isOpen) {
    return null
  }

  return (
    <div
      aria-label={ariaLabel}
      aria-live={tone === 'error' ? 'assertive' : 'polite'}
      className={['m3-snackbar', `m3-snackbar--${tone}`].join(' ')}
      role={tone === 'error' ? 'alert' : 'status'}
    >
      <p className="m3-snackbar__message">{message}</p>
      <div className="m3-snackbar__actions">
        {actionLabel ? (
          <button className="m3-snackbar__action" onClick={handleAction} type="button">
            {actionLabel}
          </button>
        ) : null}
        <button className="m3-snackbar__dismiss" onClick={closeSnackbar} type="button">
          {dismissLabel}
        </button>
      </div>
    </div>
  )
}
