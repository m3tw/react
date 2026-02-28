import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Divider } from './Divider'

describe('Divider', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a horizontal separator by default', () => {
    const { getByRole } = render(<Divider />)

    expect(getByRole('separator')).toHaveAttribute('aria-orientation', 'horizontal')
  })

  it('renders a vertical separator edge case', () => {
    const { getByRole } = render(<Divider orientation="vertical" />)

    expect(getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical')
  })
})
