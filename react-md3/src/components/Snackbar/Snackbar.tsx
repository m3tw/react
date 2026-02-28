import { useCallback, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from '../Button'

import './Snackbar.css'

type SnackbarProps = {
  message: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  actionLabel?: string
  onAction?: () => void
  closeable?: boolean
  onClose?: () => void
  autoHideDuration?: number
  className?: string
}

export function Snackbar({
  message,
  open,
  defaultOpen = false,
  onOpenChange,
  actionLabel,
  onAction,
  closeable = false,
  onClose,
  autoHideDuration = 4000,
  className,
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

  const [rendered, setRendered] = useState(isOpen)

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
    onClose?.()
    setSnackbarOpen(false)
  }, [onClose, setSnackbarOpen])

  const handleAction = useCallback(() => {
    onAction?.()
    setSnackbarOpen(false)
  }, [onAction, setSnackbarOpen])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSnackbar()
      }
    },
    [closeSnackbar],
  )

  // Deferred unmount for exit animation
  useEffect(() => {
    if (isOpen) {
      if (!rendered) {
        const timer = window.setTimeout(() => setRendered(true), 0)
        return () => window.clearTimeout(timer)
      }
      return
    }

    if (rendered) {
      const timer = window.setTimeout(() => setRendered(false), 75)
      return () => window.clearTimeout(timer)
    }
  }, [isOpen, rendered])

  // Auto-hide: disabled when actionLabel is present (M3 spec)
  useEffect(() => {
    if (!isOpen || actionLabel || autoHideDuration <= 0) {
      return
    }

    const timeout = window.setTimeout(() => {
      closeSnackbar()
    }, autoHideDuration)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [actionLabel, autoHideDuration, closeSnackbar, isOpen, message])

  const closing = rendered && !isOpen

  if (!rendered) {
    return null
  }

  return createPortal(
    <div className="m3-snackbar-portal">
      <div
        aria-live="polite"
        className={[
          'm3-snackbar',
          closing ? 'm3-snackbar--closing' : '',
          className ?? '',
        ]
          .filter(Boolean)
          .join(' ')}
        onKeyDown={handleKeyDown}
        role="status"
      >
        <p className="m3-snackbar__message">{message}</p>
        <div className="m3-snackbar__actions">
          {actionLabel ? (
            <Button className="m3-snackbar__action" onClick={handleAction} variant="text">
              {actionLabel}
            </Button>
          ) : null}
          {closeable ? (
            <button
              aria-label="Close"
              className="m3-snackbar__close"
              onClick={closeSnackbar}
              type="button"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
              </svg>
            </button>
          ) : null}
        </div>
      </div>
    </div>,
    document.body,
  )
}
