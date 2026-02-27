import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NavigationDrawer } from './NavigationDrawer'

describe('NavigationDrawer', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders complementary landmark with selectable destinations', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <NavigationDrawer
        ariaLabel="Seitliche Navigation"
        defaultValue="dashboard"
        destinations={[
          { label: 'Dashboard', value: 'dashboard' },
          { label: 'Projekte', value: 'projects' },
        ]}
        heading="Projektbereiche"
        onValueChange={onValueChange}
      />,
    )

    const projectsButton = getByRole('button', { name: 'Projekte' })
    fireEvent.click(projectsButton)

    expect(getByRole('complementary', { name: 'Seitliche Navigation' })).toBeInTheDocument()
    expect(projectsButton).toHaveAttribute('aria-current', 'page')
    expect(onValueChange).toHaveBeenCalledWith('projects')
  })

  it('keeps disabled items non-interactive and omits hidden destinations', () => {
    const onValueChange = vi.fn()
    const { getByRole, queryByRole } = render(
      <NavigationDrawer
        destinations={[
          { label: 'Dashboard', value: 'dashboard' },
          { label: 'Reports', value: 'reports', disabled: true },
          { label: 'Archiv', value: 'archive', hidden: true },
        ]}
        heading="Projektbereiche"
        onValueChange={onValueChange}
      />,
    )

    fireEvent.click(getByRole('button', { name: 'Reports' }))

    expect(getByRole('button', { name: 'Reports' })).toBeDisabled()
    expect(onValueChange).not.toHaveBeenCalled()
    expect(queryByRole('button', { name: 'Archiv' })).not.toBeInTheDocument()
  })
})
