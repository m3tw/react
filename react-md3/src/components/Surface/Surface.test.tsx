import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { Surface } from './Surface'

describe('Surface', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders content inside default surface container', () => {
    const { getByText } = render(<Surface elevation={2}>Inhalt</Surface>)

    const surface = getByText('Inhalt')
    expect(surface).toBeInTheDocument()
    expect(surface).toHaveClass('m3-surface', 'm3-surface--elevation-2')
  })

  it('supports semantic elements with tonal styling', () => {
    const { getByRole } = render(
      <Surface aria-label="Hauptinhalt" as="main" tonal>
        Fokusbereich
      </Surface>,
    )

    const main = getByRole('main', { name: 'Hauptinhalt' })
    expect(main).toHaveClass('m3-surface', 'm3-surface--tonal')
  })
})
