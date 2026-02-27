import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App getting-started flow', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders story 2.4 reference layout with semantic landmarks and navigation states', () => {
    const { getByRole, getByText, queryByRole } = render(<App />)

    expect(getByText('Story 2.4 Navigation/Surfaces')).toBeInTheDocument()
    expect(getByRole('banner', { name: 'Produktkopfzeile' })).toBeInTheDocument()
    expect(
      getByRole('heading', { name: 'Navigation Surface Referenzlayout', level: 1 }),
    ).toBeInTheDocument()
    expect(getByRole('main', { name: 'Hauptinhalt' })).toBeInTheDocument()
    expect(getByRole('navigation', { name: 'Hauptnavigation kompakt' })).toBeInTheDocument()
    expect(getByRole('complementary', { name: 'Hauptnavigation erweitert' })).toBeInTheDocument()
    expect(getByRole('button', { name: 'Sync pausiert' })).toBeDisabled()
    expect(queryByRole('button', { name: 'Versteckte Aktion' })).not.toBeInTheDocument()

    const drawerNav = getByRole('navigation', { name: 'Projektbereiche Ziele' })
    expect(within(drawerNav).getByRole('button', { name: 'Dashboard' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(within(drawerNav).queryByRole('button', { name: 'Archiv' })).not.toBeInTheDocument()

    fireEvent.click(within(drawerNav).getByRole('button', { name: 'Projekte' }))
    expect(within(drawerNav).getByRole('button', { name: 'Projekte' })).toHaveAttribute(
      'aria-current',
      'page',
    )
    expect(getByText('Aktive Destination: projekte')).toBeInTheDocument()
  })
})
