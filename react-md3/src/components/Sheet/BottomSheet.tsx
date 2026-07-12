import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { KeyboardEvent, ReactNode, TransitionEvent } from 'react'

import './BottomSheet.css'

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

type BottomSheetProps = {
  children?: ReactNode
  className?: string
  defaultOpen?: boolean
  dragHandle?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  title: string
  variant?: 'standard' | 'modal'
}

export function BottomSheet({
  children,
  className,
  defaultOpen = false,
  dragHandle = true,
  open,
  onOpenChange,
  title,
  variant = 'standard',
}: BottomSheetProps) {
  if (open !== undefined && defaultOpen !== false) {
    throw new Error('BottomSheet erwartet entweder open oder defaultOpen, nicht beides.')
  }

  if (open !== undefined && !onOpenChange) {
    throw new Error('Controlled BottomSheet erwartet onOpenChange.')
  }

  const isControlled = open !== undefined
  const [internalOpen, setInternalOpen] = useState(defaultOpen)
  const isOpen = isControlled ? open : internalOpen
  const panelRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const wasOpenRef = useRef(isOpen)
  const titleId = useId()
  const isModal = variant === 'modal'

  const [rendered, setRendered] = useState(isOpen)
  const [entered, setEntered] = useState(false)

  const setSheetOpen = (nextOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(nextOpen)
    }
    onOpenChange?.(nextOpen)
  }

  const close = () => {
    setSheetOpen(false)
  }

  // Focus management for modal
  useEffect(() => {
    if (!isOpen || !isModal || !rendered) {
      return
    }

    previousFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null

    const [firstFocusable] = getFocusableElements(panelRef.current)
    ;(firstFocusable ?? panelRef.current)?.focus()
  }, [isOpen, isModal, rendered])

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
    const timer = window.setTimeout(() => setRendered(false), 250)
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

  if (!rendered) {
    return null
  }

  const sheet = (
    <div
      aria-labelledby={titleId}
      aria-modal={isModal ? 'true' : undefined}
      className={[
        'm3-bottom-sheet',
        `m3-bottom-sheet--${variant}`,
        entered ? 'm3-bottom-sheet--open' : '',
        className ?? '',
      ].filter(Boolean).join(' ')}
      onKeyDown={handleKeyDown}
      onTransitionEnd={handleTransitionEnd}
      ref={panelRef}
      role={isModal ? 'dialog' : 'complementary'}
      tabIndex={-1}
    >
      <span className="m3-sr-only" id={titleId}>{title}</span>
      {dragHandle && (
        <div aria-hidden="true" className="m3-bottom-sheet__drag-handle">
          <div className="m3-bottom-sheet__drag-handle-pill" />
        </div>
      )}
      <div className="m3-bottom-sheet__content">
        {children}
      </div>
    </div>
  )

  if (isModal) {
    return createPortal(
      <div
        className={[
          'm3-bottom-sheet-scrim',
          entered ? 'm3-bottom-sheet-scrim--open' : '',
        ].filter(Boolean).join(' ')}
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
