import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App getting-started flow', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders story 2.3 form and selection examples including edge cases', () => {
    const { getByRole, getByText } = render(<App />)

    expect(getByText('Story 2.3 Form/Selection')).toBeInTheDocument()
    expect(getByRole('heading', { name: 'M3 Form & Selection sind bereit', level: 1 })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'M3 Referenzkomponente', level: 2 })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Standard Aktion' })).not.toBeDisabled()
    expect(getByRole('button', { name: 'Disabled Aktion' })).toBeDisabled()

    const loadingButton = getByRole('button', { name: 'Loading Edge Case' })
    expect(loadingButton).toBeDisabled()
    expect(loadingButton).toHaveAttribute('aria-busy', 'true')

    expect(getByRole('textbox', { name: 'Projektname' })).toHaveValue('M3 Formular')
    expect(getByRole('textbox', { name: 'API-Schluessel' })).toHaveAttribute('aria-invalid', 'true')
    expect(getByRole('checkbox', { name: 'Newsletter abonnieren' })).not.toBeDisabled()
    expect(getByRole('checkbox', { name: 'AGB bestaetigen' })).toBeDisabled()
    expect(getByRole('radio', { name: 'E-Mail' })).toBeChecked()
    expect(getByText('Bitte Freigabestatus festlegen.')).toBeInTheDocument()
  })
})
