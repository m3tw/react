import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { DockedToolbar } from './DockedToolbar'

describe('DockedToolbar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders with role="toolbar" and accessible name', () => {
    const { getByRole } = render(
      <DockedToolbar ariaLabel="Main actions">
        <button type="button">Action</button>
      </DockedToolbar>,
    )

    const toolbar = getByRole('toolbar', { name: 'Main actions' })
    expect(toolbar).toBeInTheDocument()
  })

  it('applies m3-docked-toolbar class by default (standard color)', () => {
    const { getByRole } = render(
      <DockedToolbar>
        <button type="button">Action</button>
      </DockedToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toHaveClass('m3-docked-toolbar')
    expect(toolbar).not.toHaveClass('m3-docked-toolbar--vibrant')
  })

  it('applies m3-docked-toolbar--vibrant when color="vibrant"', () => {
    const { getByRole } = render(
      <DockedToolbar color="vibrant">
        <button type="button">Action</button>
      </DockedToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toHaveClass('m3-docked-toolbar')
    expect(toolbar).toHaveClass('m3-docked-toolbar--vibrant')
  })

  it('renders children inside the container', () => {
    const { getByRole, getByText } = render(
      <DockedToolbar>
        <button type="button">Save</button>
        <button type="button">Delete</button>
      </DockedToolbar>,
    )

    const toolbar = getByRole('toolbar')
    expect(toolbar).toContainElement(getByText('Save'))
    expect(toolbar).toContainElement(getByText('Delete'))
  })
})
