import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { Menu } from './Menu'

describe('Menu', () => {
  afterEach(() => {
    cleanup()
  })

  it('selects menu items in standard flow', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <Menu
        items={[
          { label: 'Bearbeiten', value: 'edit' },
          { label: 'Loeschen', value: 'delete' },
        ]}
        onSelect={onSelect}
      />,
    )

    fireEvent.click(getByRole('menuitem', { name: 'Bearbeiten' }))
    expect(onSelect).toHaveBeenCalledWith('edit')
  })

  it('does not trigger selection for disabled edge-case menuitem', () => {
    const onSelect = vi.fn()
    const { getByRole } = render(
      <Menu items={[{ label: 'Archiviert', value: 'archive', disabled: true }]} onSelect={onSelect} />,
    )

    const item = getByRole('menuitem', { name: 'Archiviert' })
    expect(item).toBeDisabled()

    fireEvent.click(item)
    expect(onSelect).not.toHaveBeenCalled()
  })
})
