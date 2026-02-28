import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { ButtonGroup } from './ButtonGroup'

describe('ButtonGroup', () => {
  afterEach(() => {
    cleanup()
  })

  const options = [
    { label: 'Tag', value: 'tag' },
    { label: 'Woche', value: 'week' },
    { label: 'Monat', value: 'month' },
  ]

  it('renders segmented buttons and changes active value', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <ButtonGroup defaultValue="tag" onValueChange={onValueChange} options={options} variant="segmented" />,
    )

    fireEvent.click(getByRole('button', { name: 'Woche' }))

    expect(onValueChange).toHaveBeenCalledWith('week')
    expect(getByRole('button', { name: 'Woche' })).toHaveAttribute('aria-pressed', 'true')
  })

  it('keeps split-button edge-case option non-interactive when disabled', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <ButtonGroup
        defaultValue="tag"
        onValueChange={onValueChange}
        options={[...options, { label: 'Archiv', value: 'archive', disabled: true }]}
        variant="split"
      />, 
    )

    const disabledButton = getByRole('button', { name: 'Archiv' })
    expect(disabledButton).toBeDisabled()

    fireEvent.click(disabledButton)
    expect(onValueChange).not.toHaveBeenCalledWith('archive')
  })
})
