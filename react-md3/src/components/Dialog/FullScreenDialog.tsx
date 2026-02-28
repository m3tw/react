import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, ReactNode } from 'react'

import './FullScreenDialog.css'

const focusableSelector = [
  'button:not([disabled])',
  '[href]',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

const getFocusableElements = (container: HTMLElement | null) =>
  container
    ? Array.from(container.querySelectorAll<HTMLElement>(focusableSelector))
    : []

const CloseIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
  </svg>
)

type FullScreenDialogProps = {
  children?: ReactNode
  headline?: string
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onClose?: () => void
  onConfirm?: () => void
  confirmLabel?: string
  divider?: boolean
  className?: string
}

export function FullScreenDialog({
  children,
  headline,
  open,
  defaultOpen = false,
  onOpenChange,
  onClose,
  onConfirm,
  confirmLabel = 'Speichern',
  divider = false,
  className,
}: FullScreenDialogProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('FullScreenDialog erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled FullScreenDialog erwartet onOpenChange.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const [rendered, setRendered] = useState(isOpen)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(isOpen)
  const headlineId = useId()

  useEffect(() => {
    if (isOpen) {
      setRendered(true)
    } else if (rendered) {
      const timer = setTimeout(() => setRendered(false), 200)
      return () => clearTimeout(timer)
    }
  }, [isOpen, rendered])

  const setDialogOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const close = () => {
    onClose?.()
    setDialogOpen(false)
  }

  const confirm = () => {
    onConfirm?.()
    setDialogOpen(false)
  }

  useEffect(() => {
    if (!isOpen) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const [firstFocusable] = getFocusableElements(panelRef.current)
    ;(firstFocusable ?? panelRef.current)?.focus()
  }, [isOpen])

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      previousFocusRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      close()
      return
    }

    if (event.key !== 'Tab') {
      return
    }

    const focusableElements = getFocusableElements(panelRef.current)
    if (focusableElements.length === 0) {
      event.preventDefault()
      panelRef.current?.focus()
      return
    }

    const firstFocusable = focusableElements[0]
    const lastFocusable = focusableElements[focusableElements.length - 1]
    const activeElement = document.activeElement

    if (event.shiftKey && activeElement === firstFocusable) {
      event.preventDefault()
      lastFocusable.focus()
    }

    if (!event.shiftKey && activeElement === lastFocusable) {
      event.preventDefault()
      firstFocusable.focus()
    }
  }

  const closing = rendered && !isOpen

  if (!rendered) {
    return null
  }

  return createPortal(
    <div
      aria-labelledby={headline ? headlineId : undefined}
      aria-modal="true"
      className={['m3-fullscreen-dialog', closing ? 'm3-fullscreen-dialog--closing' : '', className ?? ''].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      ref={panelRef}
      role="dialog"
      tabIndex={-1}
    >
      <header className="m3-fullscreen-dialog__header">
        <button
          aria-label="Close"
          className="m3-fullscreen-dialog__close"
          onClick={close}
          type="button"
        >
          {CloseIcon}
        </button>
        {headline ? (
          <h2 className="m3-fullscreen-dialog__headline" id={headlineId}>
            {headline}
          </h2>
        ) : null}
        <button
          className="m3-fullscreen-dialog__action"
          onClick={confirm}
          type="button"
        >
          {confirmLabel}
        </button>
      </header>

      {divider ? <hr className="m3-fullscreen-dialog__divider" /> : null}

      <div className="m3-fullscreen-dialog__content">
        {children}
      </div>
    </div>,
    document.body,
  )
}
