import { useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NavigationRail } from './NavigationRail'

describe('NavigationRail', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders compact navigation and updates active destination on click', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <NavigationRail
        ariaLabel="Hauptnavigation kompakt"
        compact
        defaultValue="home"
        destinations={[
          { label: 'Home', value: 'home' },
          { label: 'Projekte', value: 'projects' },
        ]}
        onValueChange={onValueChange}
      />,
    )

    const projectsButton = getByRole('button', { name: 'Projekte' })
    fireEvent.click(projectsButton)

    expect(onValueChange).toHaveBeenCalledWith('projects')
    expect(projectsButton).toHaveAttribute('aria-current', 'page')
    expect(getByRole('navigation', { name: 'Hauptnavigation kompakt' })).toBeInTheDocument()
  })

  it('supports keyboard navigation while skipping disabled and hidden destinations', () => {
    const ControlledRail = () => {
      const [value, setValue] = useState('home')
      return (
        <NavigationRail
          destinations={[
            { label: 'Home', value: 'home' },
            { label: 'Reports', value: 'reports', disabled: true },
            { label: 'Einstellungen', value: 'settings' },
            { label: 'Archiv', value: 'archive', hidden: true },
          ]}
          onValueChange={setValue}
          value={value}
        />
      )
    }

    const { getByRole, queryByRole } = render(<ControlledRail />)
    const home = getByRole('button', { name: 'Home' })

    home.focus()
    fireEvent.keyDown(home, { key: 'ArrowDown' })

    const settings = getByRole('button', { name: 'Einstellungen' })
    expect(settings).toHaveAttribute('aria-current', 'page')
    expect(settings).toHaveFocus()
    expect(queryByRole('button', { name: 'Archiv' })).not.toBeInTheDocument()
  })
})
