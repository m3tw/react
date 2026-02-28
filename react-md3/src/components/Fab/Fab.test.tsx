import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Fab } from './Fab'

describe('Fab', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders an extended fab and handles click', () => {
    const onClick = vi.fn()
    const { getByRole } = render(<Fab label="Erstellen" onClick={onClick} variant="extended" />)

    const button = getByRole('button', { name: 'Erstellen' })
    fireEvent.click(button)

    expect(button).toBeInTheDocument()
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('supports fab-menu edge case with disabled items', () => {
    const onMenuSelect = vi.fn()
    const { getByRole } = render(
      <Fab
        disabled
        label="+"
        menuItems={[
          { label: 'Notiz', value: 'note' },
          { label: 'Projekt', value: 'project' },
        ]}
        onMenuSelect={onMenuSelect}
      />,
    )

    const menuItem = getByRole('menuitem', { name: 'Notiz' })
    expect(menuItem).toBeDisabled()
    fireEvent.click(menuItem)

    expect(onMenuSelect).not.toHaveBeenCalled()
  })
})
