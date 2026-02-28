import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Sheet } from './Sheet'

describe('Sheet', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a bottom sheet in standard flow', () => {
    const { getByRole } = render(<Sheet placement="bottom" title="Quick Actions" />)

    expect(getByRole('region', { name: 'Quick Actions Sheet' })).toBeInTheDocument()
  })

  it('hides side sheet edge case when open=false', () => {
    const { queryByRole } = render(<Sheet open={false} placement="side" title="Einstellungen" />)

    expect(queryByRole('region', { name: 'Einstellungen Sheet' })).not.toBeInTheDocument()
  })
})
