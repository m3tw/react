import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App getting-started flow', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the first productive component in the tutorial path', () => {
    const { getByRole, getByText } = render(<App />)

    expect(getByText('Story 1.3 Getting Started')).toBeInTheDocument()
    expect(getByRole('heading', { name: 'M3 Getting Started ist bereit', level: 1 })).toBeInTheDocument()
    expect(getByRole('heading', { name: 'M3 Referenzkomponente', level: 2 })).toBeInTheDocument()
  })
})
