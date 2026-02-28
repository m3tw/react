import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { NavigationBar } from './NavigationBar'

describe('NavigationBar', () => {
  afterEach(() => {
    cleanup()
  })

  const destinations = [
    { label: 'Start', value: 'start' },
    { label: 'Explore', value: 'explore' },
    { label: 'Archiv', value: 'archive', hidden: true },
  ]

  it('renders visible navigation destinations and switches active destination', () => {
    const onValueChange = vi.fn()
    const { getByRole } = render(
      <NavigationBar defaultValue="start" destinations={destinations} onValueChange={onValueChange} />,
    )

    fireEvent.click(getByRole('button', { name: 'Explore' }))

    expect(onValueChange).toHaveBeenCalledWith('explore')
    expect(getByRole('button', { name: 'Explore' })).toHaveAttribute('aria-current', 'page')
  })

  it('omits hidden edge-case destination entries', () => {
    const { queryByRole } = render(<NavigationBar destinations={destinations} />)

    expect(queryByRole('button', { name: 'Archiv' })).not.toBeInTheDocument()
  })
})
