import { cleanup, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'

import App from './App'

describe('App Kitchen Sink demo flow', () => {
  afterEach(() => {
    cleanup()
  })

  it('renders the Kitchen Sink layout and core components', () => {
    const { getAllByRole, getByRole, getByText } = render(<App />)

    expect(getByText('Component Overview')).toBeInTheDocument()
    expect(getByRole('banner', { name: 'App Header' })).toBeInTheDocument()
    
    // Check main navigation exists
    expect(getByRole('navigation', { name: 'Main Navigation' })).toBeInTheDocument()
    
    // Check some core component sections
    expect(getByText('Buttons & Actions')).toBeInTheDocument()
    expect(getByText('Inputs & Selections')).toBeInTheDocument()
    expect(getByText('Data Display & Indicators')).toBeInTheDocument()
    expect(getByText('Pickers & Complex')).toBeInTheDocument()
    expect(getByText('Overlays & Feedback')).toBeInTheDocument()

    // Check some buttons rendered (use getAll since labels may be shared across Button/IconButton)
    const filledButtons = getAllByRole('button', { name: 'Filled' })
    expect(filledButtons.length).toBeGreaterThan(0)
    const disabledButtons = getAllByRole('button', { name: 'Disabled' })
    expect(disabledButtons[0]).toBeDisabled()
  })
})
