import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT } from './M3ReferenceCard'

describe('M3ReferenceCard', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders title and supporting text', () => {
    const { getByRole, getByText } = render(
      <M3ReferenceCard title="M3 Button" supportingText="Primaere Aktion als Beispiel." />,
    )

    expect(getByRole('heading', { name: 'M3 Button', level: 2 })).toBeInTheDocument()
    expect(getByText('Primaere Aktion als Beispiel.')).toBeInTheDocument()
  })

  it('renders accessible region and fallback text when supporting text is omitted', () => {
    const { getByRole, getByText } = render(<M3ReferenceCard title="M3 Chip" />)

    expect(getByRole('region', { name: 'M3 Referenzkomponente' })).toBeInTheDocument()
    expect(getByText(M3_REFERENCE_FALLBACK_TEXT)).toBeInTheDocument()
  })
})
