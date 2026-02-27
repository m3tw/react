import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import { TopAppBar } from './TopAppBar'

describe('TopAppBar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders a banner with title and supporting text', () => {
    const { getByRole } = render(
      <TopAppBar
        ariaLabel="Produktkopfzeile"
        supportingText="Navigation und Oberflaeche sind zentral verfuegbar."
        title="M3 Navigation"
      />,
    )

    expect(getByRole('banner', { name: 'Produktkopfzeile' })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'M3 Navigation', level: 2 })).toBeInTheDocument()
  })

  it('keeps disabled actions non-interactive and omits hidden actions', () => {
    const { getByRole, queryByRole } = render(
      <TopAppBar
        actions={[
          { label: 'Suche' },
          { label: 'Sync pausiert', disabled: true },
          { label: 'Versteckte Aktion', hidden: true },
        ]}
        title="M3 Navigation"
      />,
    )

    expect(getByRole('button', { name: 'Suche' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Sync pausiert' })).toBeDisabled()
    expect(queryByRole('button', { name: 'Versteckte Aktion' })).not.toBeInTheDocument()
  })
})
