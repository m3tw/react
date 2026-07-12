import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Button } from "../Button";
import type { KeyboardEvent, ReactNode, TransitionEvent } from 'react'

import './Dialog.css'

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

type DialogRole = 'dialog' | 'alertdialog'

type DialogProps = {
  title: string
  description?: string
  icon?: ReactNode
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  dismissible?: boolean
  divider?: boolean
  role?: DialogRole
  className?: string
}

export function Dialog({
  title,
  description,
  icon,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmLabel = 'Bestaetigen',
  cancelLabel = 'Abbrechen',
  dismissible = true,
  divider = false,
  role = 'alertdialog',
  className,
}: DialogProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('Dialog erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled Dialog erwartet onOpenChange.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const [rendered, setRendered] = useState(isOpen)
  const [entered, setEntered] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(isOpen)
  const titleId = useId()
  const descriptionId = useId()

  // Deferred unmount so the exit transition can play; double-rAF arms the enter.
  useEffect(() => {
    if (isOpen) {
      let raf1 = 0
      let raf2 = 0
      const mountTimer = window.setTimeout(() => {
        setRendered(true)
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => setEntered(true))
        })
      }, 0)
      return () => {
        window.clearTimeout(mountTimer)
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      }
    }

    const closeTimer = window.setTimeout(() => setEntered(false), 0)
    const timer = window.setTimeout(() => setRendered(false), 100 /* keep in sync with exit duration in Dialog.css */)
    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(timer)
    }
  }, [isOpen])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!isOpen && event.target === panelRef.current) {
      setRendered(false)
    }
  }

  const setDialogOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const closeAsCancel = () => {
    onCancel?.()
    setDialogOpen(false)
  }

  const closeAsConfirm = () => {
    onConfirm?.()
    setDialogOpen(false)
  }

  useEffect(() => {
    if (!isOpen || !rendered) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const [firstFocusable] = getFocusableElements(panelRef.current)
    ;(firstFocusable ?? panelRef.current)?.focus()
  }, [isOpen, rendered])

  useEffect(() => {
    if (wasOpenRef.current && !isOpen) {
      previousFocusRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      if (dismissible) {
        event.preventDefault()
        closeAsCancel()
      }
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

  if (!rendered) {
    return null
  }

  return createPortal(
    <div
      className={['m3-dialog-scrim', entered ? 'm3-dialog-scrim--open' : ''].filter(Boolean).join(' ')}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && dismissible) {
          closeAsCancel()
        }
      }}
    >
      <div
        aria-describedby={description ? descriptionId : undefined}
        aria-labelledby={titleId}
        aria-modal="true"
        className={['m3-dialog', entered ? 'm3-dialog--open' : '', icon ? 'm3-dialog--with-icon' : '', className ?? ''].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
        onTransitionEnd={handleTransitionEnd}
        ref={panelRef}
        role={role}
        tabIndex={-1}
      >
        {icon ? <div className="m3-dialog__icon">{icon}</div> : null}

        <header className="m3-dialog__header">
          <h2 className="m3-dialog__title" id={titleId}>
            {title}
          </h2>
          {description ? (
            <p className="m3-dialog__description" id={descriptionId}>
              {description}
            </p>
          ) : null}
        </header>

        {children ? <div className="m3-dialog__content">{children}</div> : null}

        {divider ? <hr className="m3-dialog__divider" /> : null}

        <div className="m3-dialog__actions">
          <Button onClick={closeAsCancel} variant="text">
            {cancelLabel}
          </Button>
          <Button onClick={closeAsConfirm} variant="text">
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  )
}
