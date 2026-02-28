import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a large badge with label text', () => {
    const { getByRole } = render(
      <Badge label="3">
        <button>Mail</button>
      </Badge>,
    )

    const indicator = getByRole('status')
    expect(indicator).toHaveTextContent('3')
    expect(indicator).toHaveAttribute('aria-label', '3')
  })

  it('renders a small dot badge with accessible name', () => {
    const { getByRole } = render(
      <Badge>
        <button>Alerts</button>
      </Badge>,
    )

    const indicator = getByRole('status')
    expect(indicator).toHaveAttribute('aria-label', 'New notification')
    expect(indicator).toHaveTextContent('')
  })

  it('hides badge indicator when hidden but still renders children', () => {
    const { queryByRole, getByRole } = render(
      <Badge hidden label="5">
        <button>Mail</button>
      </Badge>,
    )

    expect(getByRole('button', { name: 'Mail' })).toBeInTheDocument()
    expect(queryByRole('status')).not.toBeInTheDocument()
  })

  it('renders children inside the wrapper', () => {
    const { getByRole } = render(
      <Badge label="1">
        <button>Notifications</button>
      </Badge>,
    )

    expect(getByRole('button', { name: 'Notifications' })).toBeInTheDocument()
  })

  it('renders a large badge with multi-character label', () => {
    const { getByRole } = render(
      <Badge label="99+">
        <button>Alerts</button>
      </Badge>,
    )

    expect(getByRole('status')).toHaveTextContent('99+')
  })
})
