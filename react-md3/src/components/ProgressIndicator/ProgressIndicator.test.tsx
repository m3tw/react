import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { ProgressIndicator } from './ProgressIndicator'

describe('ProgressIndicator', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders determinate progress with clamped value', () => {
    const { getByRole } = render(<ProgressIndicator value={130} />)

    expect(getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100')
  })

  it('renders loading edge case as indeterminate progress indicator', () => {
    const { getByRole } = render(<ProgressIndicator indeterminate label="Laden" />)

    expect(getByRole('progressbar', { name: 'Laden' })).toHaveAttribute('aria-valuetext', 'Ladevorgang')
  })
})
