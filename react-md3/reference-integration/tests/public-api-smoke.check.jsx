import { render, screen } from '@testing-library/react'
import {
  AlertDialog,
  Dialog,
  NavigationDrawer,
  NavigationRail,
  Snackbar,
  Surface,
  TopAppBar,
} from 'react-md3'
import { describe, expect, it } from 'vitest'

import { App } from '../src/App'

describe('reference integration smoke', () => {
  it('renders the reference application via public package entry', () => {
    render(<App />)

    expect(screen.getByRole('heading', { level: 2, name: 'Reference Integration Smoke' })).toBeInTheDocument()
    expect(screen.getByText('Public API only')).toBeInTheDocument()
    expect(screen.getByLabelText('Dialog export vorhanden')).toHaveTextContent('Dialog exportiert: true')
  })

  it('exposes required components from the public entry', () => {
    expect(AlertDialog).toBeTruthy()
    expect(Dialog).toBeTruthy()
    expect(NavigationDrawer).toBeTruthy()
    expect(NavigationRail).toBeTruthy()
    expect(Snackbar).toBeTruthy()
    expect(Surface).toBeTruthy()
    expect(TopAppBar).toBeTruthy()
  })
})
