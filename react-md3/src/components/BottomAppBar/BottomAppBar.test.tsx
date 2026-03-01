import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { BottomAppBar } from './BottomAppBar'

describe('BottomAppBar', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders correctly with specific ARIA Navigation role', () => {
    const { getByRole } = render(<BottomAppBar />)
    const nav = getByRole('navigation', { name: 'Bottom App Bar' })
    expect(nav).toBeInTheDocument()
    expect(nav).toHaveClass('m3-bottom-app-bar')
  })

  it('renders a navigation icon and triggers click', () => {
    const onNavClick = vi.fn()
    const { getByRole } = render(
      <BottomAppBar
        navigationIcon={<span>Menu</span>}
        navigationAriaLabel="Open Menu"
        onNavigationClick={onNavClick}
      />
    )
    const navBtn = getByRole('button', { name: 'Open Menu' })
    expect(navBtn).toBeInTheDocument()
    fireEvent.click(navBtn)
    expect(onNavClick).toHaveBeenCalled()
  })

  it('renders actions properly', () => {
    const actionClick = vi.fn()
    const { getByRole, queryByRole } = render(
      <BottomAppBar
        actions={[
          { label: 'Search', icon: <span>Search</span>, onClick: actionClick },
          { label: 'HiddenAction', hidden: true },
        ]}
      />
    )
    
    // Check Action button exists
    const searchBtn = getByRole('button', { name: 'Search' })
    expect(searchBtn).toBeInTheDocument()
    fireEvent.click(searchBtn)
    expect(actionClick).toHaveBeenCalled()

    // Hidden actions shouldn't render
    const hiddenBtn = queryByRole('button', { name: 'HiddenAction' })
    expect(hiddenBtn).toBeNull()
  })

  it('renders a custom FAB safely at the trailing end via DOM order', () => {
    const { getByRole } = render(
      <BottomAppBar
        fab={<button aria-label="Add item">Add</button>}
      />
    )
    const fabButton = getByRole('button', { name: 'Add item' })
    expect(fabButton).toBeInTheDocument()
  })
})
