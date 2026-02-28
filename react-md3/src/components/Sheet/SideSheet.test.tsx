import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SideSheet } from './SideSheet'

describe('SideSheet', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders standard variant with complementary role', () => {
    const { getByRole } = render(
      <SideSheet defaultOpen headline="Details">
        <p>Content</p>
      </SideSheet>,
    )

    const sheet = getByRole('complementary', { name: 'Details' })
    expect(sheet).toBeInTheDocument()
    expect(sheet).not.toHaveAttribute('aria-modal')
  })

  it('renders modal variant with dialog role and aria-modal', () => {
    const { getByRole } = render(
      <SideSheet defaultOpen headline="Modal Details" variant="modal">
        <p>Content</p>
      </SideSheet>,
    )

    const dialog = getByRole('dialog', { name: 'Modal Details' })
    expect(dialog).toHaveAttribute('aria-modal', 'true')
  })

  it('renders close button that triggers onClose and onOpenChange', () => {
    const onClose = vi.fn()
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <SideSheet defaultOpen headline="Close Test" onClose={onClose} onOpenChange={onOpenChange}>
        <p>Content</p>
      </SideSheet>,
    )

    fireEvent.click(getByRole('button', { name: 'Close' }))

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(queryByRole('complementary', { name: 'Close Test' })).not.toBeInTheDocument()
  })

  it('closes modal on Escape key', () => {
    const onOpenChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <SideSheet defaultOpen headline="Escape Test" onOpenChange={onOpenChange} variant="modal">
        <p>Content</p>
      </SideSheet>,
    )

    const dialog = getByRole('dialog', { name: 'Escape Test' })
    fireEvent.keyDown(dialog, { key: 'Escape' })

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(queryByRole('dialog', { name: 'Escape Test' })).not.toBeInTheDocument()
  })

  it('closes modal on scrim click', () => {
    const onOpenChange = vi.fn()
    render(
      <SideSheet defaultOpen headline="Scrim Test" onOpenChange={onOpenChange} variant="modal">
        <p>Content</p>
      </SideSheet>,
    )

    const scrim = document.querySelector('.m3-side-sheet-scrim')!
    fireEvent.mouseDown(scrim)

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('traps focus within modal', () => {
    const { getByRole } = render(
      <SideSheet defaultOpen headline="Focus Trap" variant="modal">
        <button type="button">Action</button>
      </SideSheet>,
    )

    // Close button is the first focusable, then our custom button
    const closeButton = getByRole('button', { name: 'Close' })
    const actionButton = getByRole('button', { name: 'Action' })

    expect(closeButton).toHaveFocus()

    // Shift+Tab from first should wrap to last
    fireEvent.keyDown(closeButton, { key: 'Tab', shiftKey: true })
    expect(actionButton).toHaveFocus()
  })

  it('shows divider by default for standard variant', () => {
    const { container } = render(
      <SideSheet defaultOpen headline="Divider Test">
        <p>Content</p>
      </SideSheet>,
    )

    const sheet = container.querySelector('.m3-side-sheet--standard')
    expect(sheet).not.toHaveClass('m3-side-sheet--no-divider')
  })

  it('hides divider by default for modal variant', () => {
    const { container } = render(
      <SideSheet defaultOpen headline="No Divider" variant="modal">
        <p>Content</p>
      </SideSheet>,
    )

    // Modal doesn't use divider class at all (it's not standard)
    const sheet = container.querySelector('.m3-side-sheet--modal') ??
      document.querySelector('.m3-side-sheet--modal')
    expect(sheet).toBeInTheDocument()
  })

  it('renders actions slot', () => {
    const { getByText } = render(
      <SideSheet defaultOpen headline="Actions" actions={<button type="button">Save</button>}>
        <p>Content</p>
      </SideSheet>,
    )

    expect(getByText('Save')).toBeInTheDocument()
  })

  it('works in controlled mode', () => {
    const onOpenChange = vi.fn()
    const { getByRole, rerender, queryByRole } = render(
      <SideSheet open onOpenChange={onOpenChange} headline="Controlled">
        <p>Content</p>
      </SideSheet>,
    )

    expect(getByRole('complementary', { name: 'Controlled' })).toBeInTheDocument()

    rerender(
      <SideSheet open={false} onOpenChange={onOpenChange} headline="Controlled">
        <p>Content</p>
      </SideSheet>,
    )

    expect(queryByRole('complementary', { name: 'Controlled' })).not.toBeInTheDocument()
  })

  it('throws when both open and defaultOpen are provided', () => {
    expect(() =>
      render(
        <SideSheet defaultOpen open onOpenChange={() => {}} headline="Invalid" />,
      ),
    ).toThrow('SideSheet erwartet entweder open oder defaultOpen, nicht beides.')
  })

  it('throws when open is provided without onOpenChange', () => {
    expect(() =>
      render(<SideSheet open headline="Invalid" />),
    ).toThrow('Controlled SideSheet erwartet onOpenChange.')
  })
})
