import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimePickerModal } from './TimePickerModal'

describe('TimePickerModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the dialog synchronously when initially open', () => {
    const { getByRole } = render(<TimePickerModal open />)
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('mounts the dialog when controlled open flips to true', () => {
    const { queryByRole, getByRole, rerender } = render(<TimePickerModal open={false} />)
    expect(queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<TimePickerModal open />)
    act(() => { vi.advanceTimersByTime(50) })
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps the dialog mounted during exit, then unmounts', () => {
    const { getByRole, queryByRole, rerender } = render(<TimePickerModal open />)
    expect(getByRole('dialog')).toBeInTheDocument()

    rerender(<TimePickerModal open={false} />)
    expect(queryByRole('dialog')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(250) })
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onCancel when the scrim is clicked', () => {
    const onCancel = vi.fn()
    render(<TimePickerModal open onCancel={onCancel} />)

    fireEvent.click(document.querySelector('.m3-timepicker-modal__scrim')!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
