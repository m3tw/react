import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Slider } from './Slider'

describe('Slider', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders slider and emits value changes', () => {
    const onValueChange = vi.fn()
    const { getByLabelText } = render(<Slider label="Lautstaerke" onValueChange={onValueChange} />)

    fireEvent.change(getByLabelText('Lautstaerke'), { target: { value: '64' } })
    expect(onValueChange).toHaveBeenCalledWith(64)
  })

  it('keeps disabled slider edge case non-editable', () => {
    const { getByLabelText } = render(<Slider disabled label="Brightness" />)

    expect(getByLabelText('Brightness')).toBeDisabled()
  })

  it('generates unique ids when the same label is reused', () => {
    const { getAllByLabelText } = render(
      <>
        <Slider label="Level" />
        <Slider label="Level" />
      </>,
    )

    const sliders = getAllByLabelText('Level') as HTMLInputElement[]
    expect(sliders[0].id).not.toBe(sliders[1].id)
  })
})
