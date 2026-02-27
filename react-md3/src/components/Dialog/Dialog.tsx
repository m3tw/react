import { useEffect, useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'

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
  children?: ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onConfirm?: () => void
  onCancel?: () => void
  confirmLabel?: string
  cancelLabel?: string
  dismissible?: boolean
  role?: DialogRole
  className?: string
}

export function Dialog({
  title,
  description,
  children,
  open,
  defaultOpen = false,
  onOpenChange,
  onConfirm,
  onCancel,
  confirmLabel = 'Bestaetigen',
  cancelLabel = 'Abbrechen',
  dismissible = true,
  role = 'dialog',
  className,
}: DialogProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('Dialog erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled Dialog erwartet onOpenChange.')
  }

  if (role === 'alertdialog' && !description) {
    throw new Error('AlertDialog erfordert eine Description fuer aria-describedby.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(isOpen)
  const titleId = useId()
  const descriptionId = useId()

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

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="m3-dialog-scrim"
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
        className={['m3-dialog', className ?? ''].filter(Boolean).join(' ')}
        onKeyDown={handleKeyDown}
        ref={panelRef}
        role={role}
        tabIndex={-1}
      >
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

        <div className="m3-dialog__actions">
          <button className="m3-dialog__action" onClick={closeAsCancel} type="button">
            {cancelLabel}
          </button>
          <button
            className="m3-dialog__action m3-dialog__action--primary"
            onClick={closeAsConfirm}
            type="button"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
