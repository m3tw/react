import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

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

  it('renders navigation icon and fires onClick', () => {
    const onNav = vi.fn()
    const { getByRole } = render(
      <TopAppBar
        title="Dashboard"
        navigationIcon={<svg data-testid="menu-icon" />}
        onNavigationClick={onNav}
        navigationAriaLabel="Open menu"
      />,
    )

    const navBtn = getByRole('button', { name: 'Open menu' })
    expect(navBtn).toBeInTheDocument()
    fireEvent.click(navBtn)
    expect(onNav).toHaveBeenCalledOnce()
  })

  it('applies variant class', () => {
    const { getByRole } = render(
      <TopAppBar title="Settings" variant="large" ariaLabel="Settings bar" />,
    )

    const header = getByRole('banner', { name: 'Settings bar' })
    expect(header.classList.contains('m3-top-app-bar--large')).toBe(true)
  })
})
