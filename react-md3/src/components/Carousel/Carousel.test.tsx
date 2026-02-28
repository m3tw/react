import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Carousel } from './Carousel'

describe('Carousel', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the current item and advances to the next item', () => {
    const { getByRole, getByText } = render(<Carousel items={['Karte 1', 'Karte 2']} />)

    expect(getByRole('region', { name: 'Carousel' })).toBeInTheDocument()
    expect(getByText('Karte 1')).toBeInTheDocument()

    fireEvent.click(getByRole('button', { name: 'Weiter' }))
    expect(getByText('Karte 2')).toBeInTheDocument()
  })

  it('clamps out-of-range activeIndex edge case to the first item', () => {
    const { getByText } = render(<Carousel activeIndex={-4} items={['A', 'B']} />)

    expect(getByText('A')).toBeInTheDocument()
  })
})
