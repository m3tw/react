import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a semantic checkbox and handles standard interaction', () => {
    const onChange = vi.fn()
    const { getByRole } = render(<Checkbox label="Newsletter abonnieren" onChange={onChange} />)

    const checkbox = getByRole('checkbox', { name: 'Newsletter abonnieren' })
    fireEvent.click(checkbox)

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(checkbox).toBeChecked()
  })

  it('handles disabled and error edge cases without silent interaction', () => {
    const onChange = vi.fn()
    const { getByRole } = render(
      <Checkbox
        disabled
        errorText="Bestaetigung ist erforderlich."
        label="AGB bestaetigen"
        onChange={onChange}
      />,
    )

    const checkbox = getByRole('checkbox', { name: 'AGB bestaetigen' })
    expect(checkbox).toBeDisabled()
    expect(checkbox).toHaveAttribute('aria-invalid', 'true')
    expect(getByRole('alert')).toHaveTextContent('Bestaetigung ist erforderlich.')

    fireEvent.click(checkbox)
    expect(onChange).not.toHaveBeenCalled()
  })
})
