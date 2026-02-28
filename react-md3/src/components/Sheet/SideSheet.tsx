import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, ReactNode } from 'react'
import { IconButton } from '../IconButton'

import './SideSheet.css'

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

type SideSheetProps = {
  actions?: ReactNode
  children?: ReactNode
  className?: string
  defaultOpen?: boolean
  divider?: boolean
  headline: string
  onClose?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
  variant?: 'standard' | 'modal'
}

export function SideSheet({
  actions,
  children,
  className,
  defaultOpen = false,
  divider,
  headline,
  onClose,
  open,
  onOpenChange,
  variant = 'standard',
}: SideSheetProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('SideSheet erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled SideSheet erwartet onOpenChange.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(isOpen)
  const headlineId = useId()
  const isModal = variant === 'modal'
  const showDivider = divider ?? (variant === 'standard')

  const setSheetOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const close = () => {
    onClose?.()
    setSheetOpen(false)
  }

  // Focus management for modal
  useEffect(() => {
    if (!isOpen || !isModal) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const [firstFocusable] = getFocusableElements(panelRef.current)
    ;(firstFocusable ?? panelRef.current)?.focus()
  }, [isOpen, isModal])

  // Restore focus on close
  useEffect(() => {
    if (wasOpenRef.current && !isOpen && isModal) {
      previousFocusRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen, isModal])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isModal) {
      return
    }

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

  if (!isOpen) {
    return null
  }

  const sheet = (
    <div
      aria-labelledby={headlineId}
      aria-modal={isModal ? 'true' : undefined}
      className={[
        'm3-side-sheet',
        `m3-side-sheet--${variant}`,
        !showDivider && variant === 'standard' ? 'm3-side-sheet--no-divider' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      ref={panelRef}
      role={isModal ? 'dialog' : 'complementary'}
      tabIndex={-1}
    >
      <header className="m3-side-sheet__header">
        <h2 className="m3-side-sheet__headline" id={headlineId}>{headline}</h2>
        <IconButton
          ariaLabel="Close"
          icon={CloseIcon}
          onClick={close}
        />
      </header>
      <div className="m3-side-sheet__content">
        {children}
      </div>
      {actions && (
        <div className="m3-side-sheet__actions">
          {actions}
        </div>
      )}
    </div>
  )

  if (isModal) {
    return createPortal(
      <div
        className="m3-side-sheet-scrim"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) {
            close()
          }
        }}
      >
        {sheet}
      </div>,
      document.body,
    )
  }

  return sheet
}
