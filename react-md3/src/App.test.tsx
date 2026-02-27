import { cleanup, fireEvent, render, within } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App getting-started flow', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders story 2.5 reference layout with overlay interactions', () => {
    const { getByRole, getByText, queryByRole } = render(<App />)

    expect(getByText('Story 2.5 Feedback/Overlay')).toBeInTheDocument()
    expect(getByRole('banner', { name: 'Produktkopfzeile' })).toBeInTheDocument()
    expect(
      getByRole('heading', { name: 'Feedback Overlay Referenzlayout', level: 1 }),
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

    fireEvent.click(getByRole('button', { name: 'Error zeigen' }))
    expect(getByRole('alert')).toBeInTheDocument()

    fireEvent.click(getByRole('button', { name: 'Erneut versuchen' }))
    expect(queryByRole('alert')).not.toBeInTheDocument()
    expect(getByText('Retry fuer fehlgeschlagenen Vorgang gestartet.')).toBeInTheDocument()

    fireEvent.click(getByRole('button', { name: 'Kritischen AlertDialog oeffnen' }))
    expect(getByRole('alertdialog', { name: 'Destruktive Aktion bestaetigen' })).toBeInTheDocument()

    fireEvent.click(getByRole('button', { name: 'Loeschen' }))
    expect(
      queryByRole('alertdialog', { name: 'Destruktive Aktion bestaetigen' }),
    ).not.toBeInTheDocument()
    expect(getByText('Destructive Confirm ausgefuehrt.')).toBeInTheDocument()
  })
})
