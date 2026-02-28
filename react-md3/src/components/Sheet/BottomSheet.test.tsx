import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { BottomSheet } from './BottomSheet'

describe('BottomSheet', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders standard variant with complementary role', () => {
    const { getByRole } = render(
      <BottomSheet defaultOpen title="Quick Actions">
        <p>Content</p>
      </BottomSheet>,
    )

    const sheet = getByRole('complementary', { name: 'Quick Actions' })
    expect(sheet).toBeInTheDocument()
    expect(sheet).not.toHaveAttribute('aria-modal')
  })

  it('renders modal variant with dialog role and aria-modal', () => {
    const { getByRole } = render(
      <BottomSheet defaultOpen title="Modal Sheet" variant="modal">
        <p>Content</p>
      </BottomSheet>,
    )

    const dialog = getByRole('dialog', { name: 'Modal Sheet' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders drag handle by default', () => {
    const { container } = render(
      <BottomSheet defaultOpen title="Drag Handle Test" />,
    )

    expect(container.querySelector('.m3-bottom-sheet__drag-handle')).toBeInTheDocument()
  })

  it('hides drag handle when dragHandle is false', () => {
    const { container } = render(
      <BottomSheet defaultOpen dragHandle={false} title="No Drag Handle" />,
    )

    expect(container.querySelector('.m3-bottom-sheet__drag-handle')).not.toBeInTheDocument()
  })

  it('closes modal on Escape key', () => {
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <BottomSheet defaultOpen onOpenChange={onOpenChange} title="Escape Test" variant="modal">
        <button type="button">Action</button>
      </BottomSheet>,
    )

    const dialog = getByRole('dialog', { name: 'Escape Test' })
    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(queryByRole('dialog', { name: 'Escape Test' })).not.toBeInTheDocument()
  })

  it('closes modal on scrim click', () => {
    const onOpenChange = vi.fn()
    render(
      <BottomSheet defaultOpen onOpenChange={onOpenChange} title="Scrim Test" variant="modal">
        <p>Content</p>
      </BottomSheet>,
    )

    const scrim = document.querySelector('.m3-bottom-sheet-scrim')!
    fireEvent.mouseDown(scrim)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('traps focus within modal', () => {
    const { getByRole } = render(
      <BottomSheet defaultOpen title="Focus Trap" variant="modal">
        <button type="button">First</button>
        <button type="button">Last</button>
      </BottomSheet>,
    )

    const firstButton = getByRole('button', { name: 'First' })
    const lastButton = getByRole('button', { name: 'Last' })

    expect(firstButton).toHaveFocus()

    fireEvent.keyDown(lastButton, { key: 'Tab' })
    // Focus should wrap
    lastButton.focus()
    fireEvent.keyDown(lastButton, { key: 'Tab' })

    fireEvent.keyDown(firstButton, { key: 'Tab', shiftKey: true })
    expect(lastButton).toHaveFocus()
  })

  it('works in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { getByRole, rerender, queryByRole } = render(
      <BottomSheet open onOpenChange={onOpenChange} title="Controlled">
        <p>Content</p>
      </BottomSheet>,
    )

    expect(getByRole('complementary', { name: 'Controlled' })).toBeInTheDocument()

    rerender(
      <BottomSheet open={false} onOpenChange={onOpenChange} title="Controlled">
        <p>Content</p>
      </BottomSheet>,
    )

    expect(queryByRole('complementary', { name: 'Controlled' })).not.toBeInTheDocument()
  })

  it('throws when both open and defaultOpen are provided', () => {
    expect(() =>
      render(
        <BottomSheet defaultOpen open onOpenChange={() => {}} title="Invalid" />,
      ),
    ).toThrow('BottomSheet erwartet entweder open oder defaultOpen, nicht beides.')
  })

  it('throws when open is provided without onOpenChange', () => {
    expect(() =>
      render(<BottomSheet open title="Invalid" />),
    ).toThrow('Controlled BottomSheet erwartet onOpenChange.')
  })
})
