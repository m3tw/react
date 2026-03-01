import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi, afterEach } from 'vitest'
import { List } from './List'

describe('List', () => {
  afterEach(cleanup)

  const defaultItems = [
    { headline: 'Item 1', value: '1' },
    { headline: 'Item 2', value: '2' },
    { headline: 'Item 3', value: '3' },
  ]

  it('renders a selectable list and changes active option', () => {
    const onValueChange = vi.fn()

    render(<List items={defaultItems} onValueChange={onValueChange} defaultValue="1" />)
    
    // Check root accessiblity
    const listbox = screen.getByRole('listbox')
    expect(listbox).toBeDefined()
    expect(listbox.getAttribute('aria-label')).toBe('List')

    // Find and verify options
    const options = screen.getAllByRole('option')
    expect(options).toHaveLength(3)

    // Check default selection
    expect(options[0].getAttribute('aria-selected')).toBe('true')
    expect(options[0].classList.contains('m3-list__item--active')).toBe(true)
    expect(options[1].getAttribute('aria-selected')).toBe('false')

    // Click second option
    fireEvent.click(options[1])
    
    expect(onValueChange).toHaveBeenCalledWith('2')
    expect(options[1].getAttribute('aria-selected')).toBe('true')
    expect(options[0].getAttribute('aria-selected')).toBe('false')
  })

  it('supports multi-line rendering with leading elements', () => {
    const complexItems = [
      { 
        headline: 'Primary Text', 
        supportingText: 'Secondary Text',
        leadingElement: <span data-testid="icon" />,
        value: '1' 
      },
    ]

    render(<List items={complexItems} />)
    
    expect(screen.getByText('Primary Text')).toBeDefined()
    expect(screen.getByText('Secondary Text')).toBeDefined()
    expect(screen.getByTestId('icon')).toBeDefined()
    
    // Check class triggers
    const option = screen.getByRole('option')
    expect(option.classList.contains('m3-list__item--multiline')).toBe(true)
  })

  it('handles keyboard navigation securely within the listbox', () => {
    render(<List items={defaultItems} />)

    const listbox = screen.getByRole('listbox')
    listbox.focus()

    const options = screen.getAllByRole('option')
    options[0].focus()

    // Arrow keys traversal
    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(document.activeElement).toBe(options[1])

    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(document.activeElement).toBe(options[2])

    // Loops around to top
    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' })
    expect(document.activeElement).toBe(options[0])

    // Loops around to bottom
    fireEvent.keyDown(listbox, { key: 'ArrowUp', code: 'ArrowUp' })
    expect(document.activeElement).toBe(options[2])
    
    // Home / End jumps
    fireEvent.keyDown(listbox, { key: 'Home', code: 'Home' })
    expect(document.activeElement).toBe(options[0])
    
    fireEvent.keyDown(listbox, { key: 'End', code: 'End' })
    expect(document.activeElement).toBe(options[2])
  })

  it('skips disabled items during interaction', () => {
    const handleSelect = vi.fn()
    const items = [
      { headline: 'Item 1', value: '1' },
      { headline: 'Item 2', value: '2', disabled: true },
      { headline: 'Item 3', value: '3' },
    ]

    render(<List items={items} onValueChange={handleSelect} />)

    const options = screen.getAllByRole('option')
    const listbox = screen.getByRole('listbox')
    
    // Disabled items should have proper aria labels
    expect(options[1].getAttribute('aria-disabled')).toBe('true')
    expect(options[1].tabIndex).toBe(-1)
    
    // Click fails
    fireEvent.click(options[1])
    expect(handleSelect).not.toHaveBeenCalled()
    expect(options[1].getAttribute('aria-selected')).toBe('false')

    // Keyboard skips over disabled directly from 1 to 3
    listbox.focus()
    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' })
    fireEvent.keyDown(listbox, { key: 'ArrowDown', code: 'ArrowDown' })
    
    // Should jump from options[0] -> options[2] because options[1] is disabled
    expect(document.activeElement).toBe(options[2])
  })
})
