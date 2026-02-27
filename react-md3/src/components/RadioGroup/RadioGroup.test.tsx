import { useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { RadioGroup } from './RadioGroup'

describe('RadioGroup', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders radio options and reports value changes', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <RadioGroup
        label="Kontaktkanal"
        onValueChange={onValueChange}
        options={[
          { label: 'E-Mail', value: 'email' },
          { label: 'Telefon', value: 'phone' },
        ]}
      />,
    )

    const email = getByRole('radio', { name: 'E-Mail' })
    fireEvent.click(email)

    expect(email).toBeChecked()
    expect(onValueChange).toHaveBeenCalledWith('email')
  })

  it('surfaces validation state and supports arrow-key selection changes', () => {
    const ControlledRadioGroup = () => {
      const [value, setValue] = useState('email')
      return (
        <RadioGroup
          errorText="Bitte einen Kontaktkanal waehlen."
          label="Kontaktkanal"
          onValueChange={setValue}
          options={[
            { label: 'E-Mail', value: 'email' },
            { label: 'Telefon', value: 'phone' },
          ]}
          value={value}
        />
      )
    }

    const { getByRole } = render(<ControlledRadioGroup />)

    const radioGroup = getByRole('radiogroup')
    const email = getByRole('radio', { name: 'E-Mail' })
    const phone = getByRole('radio', { name: 'Telefon' })

    email.focus()
    fireEvent.keyDown(email, { key: 'ArrowDown' })

    expect(radioGroup).toHaveAttribute('aria-invalid', 'true')
    expect(getByRole('alert')).toHaveTextContent('Bitte einen Kontaktkanal waehlen.')
    expect(phone).toBeChecked()
    expect(phone).toHaveFocus()
  })

  it('keeps disabled options non-interactive', () => {
    const { getByRole } = render(
      <RadioGroup
        label="Kontaktkanal"
        onValueChange={vi.fn()}
        options={[
          { label: 'E-Mail', value: 'email' },
          { label: 'Telefon', value: 'phone', disabled: true },
        ]}
      />,
    )

    const phone = getByRole('radio', { name: 'Telefon' })
    expect(phone).toBeDisabled()
  })
})
