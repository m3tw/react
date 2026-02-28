import { cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { SearchBar } from './SearchBar'

describe('SearchBar', () => {
  afterEach(() => {
    cleanup()
  })

  it('submits non-empty search query in standard flow', () => {
    const onSearch = vi.fn()
    const { getByRole } = render(<SearchBar onSearch={onSearch} />)

    fireEvent.change(getByRole('searchbox'), { target: { value: 'navigation' } })
    fireEvent.click(getByRole('button', { name: 'Suchen' }))

    expect(onSearch).toHaveBeenCalledWith('navigation')
  })

  it('shows error edge case when search query is empty', () => {
    const onSearch = vi.fn()
    const { getByRole } = render(<SearchBar onSearch={onSearch} />)

    fireEvent.click(getByRole('button', { name: 'Suchen' }))

    expect(onSearch).not.toHaveBeenCalled()
    expect(getByRole('alert')).toHaveTextContent('Bitte Suchbegriff eingeben.')
  })
})
