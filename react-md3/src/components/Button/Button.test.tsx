import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Button } from './Button'

describe('Button', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a semantic button with default variant and label', () => {
    const { getByRole } = render(<Button>Speichern</Button>)
    const button = getByRole('button', { name: 'Speichern' })

    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('data-variant', 'filled')
  })

  it('calls onClick while enabled', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<Button onClick={onClick}>Ausfuehren</Button>)

    fireEvent.click(getByRole('button', { name: 'Ausfuehren' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports a custom variant while disabled', () => {
    const { getByRole } = render(
      <Button disabled variant="text">
        Abbrechen
      </Button>,
    )

    const button = getByRole('button', { name: 'Abbrechen' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('data-variant', 'text')
    expect(button).not.toHaveAttribute('aria-busy')
  })

  it('handles edge case loading by disabling interaction and exposing busy state', () => {
    const onClick = vi.fn()
    const { getByRole } = render(
      <Button loading onClick={onClick}>
        Senden
      </Button>,
    )

    const button = getByRole('button', { name: 'Senden' })
    expect(button).toBeDisabled()
    expect(button).toHaveAttribute('aria-busy', 'true')

    fireEvent.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
