import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Badge } from './Badge'

describe('Badge', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a visible status badge with tone', () => {
    const { getByRole } = render(<Badge label="Neu" tone="success" />)

    expect(getByRole('status', { name: 'Neu Badge' })).toHaveTextContent('Neu')
  })

  it('hides the badge in hidden edge-case mode', () => {
    const { queryByRole } = render(<Badge hidden label="Versteckt" />)

    expect(queryByRole('status', { name: 'Versteckt Badge' })).not.toBeInTheDocument()
  })
})
