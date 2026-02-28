import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { Snackbar } from './Snackbar'

describe('Snackbar', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    cleanup()
  })

  it('renders with role="status" and aria-live="polite"', () => {
    const { getByRole } = render(<Snackbar defaultOpen message="Hello" />)
    const snackbar = getByRole('status')
    expect(snackbar).toHaveAttribute('aria-live', 'polite')
  })

  it('shows message text', () => {
    const { getByText } = render(<Snackbar defaultOpen message="File saved" />)
    expect(getByText('File saved')).toBeInTheDocument()
  })

  it('calls onAction when action button clicked and closes', () => {
    const onAction = vi.fn()
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <Snackbar
        actionLabel="Undo"
        defaultOpen
        message="Deleted"
        onAction={onAction}
        onOpenChange={onOpenChange}
      />,
    )

    fireEvent.click(getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledTimes(1)

    act(() => { vi.advanceTimersByTime(100) })
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('shows close icon when closeable and calls onClose', () => {
    const onClose = vi.fn()
    const { getByRole, queryByRole } = render(
      <Snackbar closeable defaultOpen message="Info" onClose={onClose} />,
    )

    fireEvent.click(getByRole('button', { name: 'Close' }))
    expect(onClose).toHaveBeenCalledTimes(1)

    act(() => { vi.advanceTimersByTime(100) })
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('does NOT auto-dismiss when actionLabel is present', () => {
    const onOpenChange = vi.fn()
    const { getByRole } = render(
      <Snackbar
        actionLabel="Undo"
        defaultOpen
        message="With action"
        onAction={() => {}}
        onOpenChange={onOpenChange}
      />,
    )

    act(() => { vi.advanceTimersByTime(10000) })
    expect(getByRole('status')).toBeInTheDocument()
    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it('auto-dismisses after duration when no action', () => {
    const onOpenChange = vi.fn()
    const { queryByRole } = render(
      <Snackbar
        autoHideDuration={2000}
        defaultOpen
        message="Auto-dismiss"
        onOpenChange={onOpenChange}
      />,
    )

    act(() => { vi.advanceTimersByTime(1999) })
    expect(queryByRole('status')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(1) })
    expect(onOpenChange).toHaveBeenCalledWith(false)

    act(() => { vi.advanceTimersByTime(100) })
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('closes on Escape key', () => {
    const onClose = vi.fn()
    const { getByRole, queryByRole } = render(
      <Snackbar closeable defaultOpen message="Escape me" onClose={onClose} />,
    )

    fireEvent.keyDown(getByRole('status'), { key: 'Escape' })
    expect(onClose).toHaveBeenCalledTimes(1)

    act(() => { vi.advanceTimersByTime(100) })
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders in a portal (not inside its parent)', () => {
    const { container } = render(
      <div data-testid="parent">
        <Snackbar defaultOpen message="Portal test" />
      </div>,
    )

    expect(container.querySelector('.m3-snackbar')).toBeNull()
    expect(document.body.querySelector('.m3-snackbar')).toBeInTheDocument()
  })

  it('validates actionLabel requires onAction', () => {
    expect(() =>
      render(<Snackbar actionLabel="Undo" defaultOpen message="Invalid" />),
    ).toThrow('actionLabel und onAction')
  })
})
