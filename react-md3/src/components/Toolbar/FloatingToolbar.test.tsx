import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { FloatingToolbar } from './FloatingToolbar'

describe('FloatingToolbar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with role="toolbar" and accessible name', () => {
    const { getByRole } = render(
      <FloatingToolbar ariaLabel="Quick actions">
        <button type="button">Action</button>
      </FloatingToolbar>,
    )

    const toolbar = getByRole('toolbar', { name: 'Quick actions' })
    expect(toolbar).toBeInTheDocument()
  })

  it('applies standard + horizontal classes by default', () => {
    const { getByRole } = render(
      <FloatingToolbar>
        <button type="button">Action</button>
      </FloatingToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toHaveClass('m3-floating-toolbar')
    expect(toolbar).not.toHaveClass('m3-floating-toolbar--vibrant')
    expect(toolbar).not.toHaveClass('m3-floating-toolbar--vertical')
    expect(toolbar).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('applies vibrant color class', () => {
    const { getByRole } = render(
      <FloatingToolbar color="vibrant">
        <button type="button">Action</button>
      </FloatingToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toHaveClass('m3-floating-toolbar')
    expect(toolbar).toHaveClass('m3-floating-toolbar--vibrant')
  })

  it('applies vertical orientation class and aria-orientation="vertical"', () => {
    const { getByRole } = render(
      <FloatingToolbar orientation="vertical">
        <button type="button">Action</button>
      </FloatingToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toHaveClass('m3-floating-toolbar--vertical')
    expect(toolbar).toHaveAttribute('aria-orientation', 'vertical')
  })

  it('renders children inside the container', () => {
    const { getByRole, getByText } = render(
      <FloatingToolbar>
        <button type="button">Edit</button>
        <button type="button">Share</button>
      </FloatingToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toContainElement(getByText('Edit'))
    expect(toolbar).toContainElement(getByText('Share'))
  })
})
