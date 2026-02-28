import { useState, useRef, useEffect, type ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './SplitButton.css'

type SplitButtonMenuItem = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

type SplitButtonVariant = 'filled' | 'tonal' | 'outlined' | 'elevated'
type SplitButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'

type SplitButtonProps = {
  /** Primary action label */
  label: string
  /** Primary action icon */
  icon?: ReactNode
  /** Primary action click handler */
  onClick?: () => void
  /** Dropdown menu items */
  menuItems: readonly SplitButtonMenuItem[]
  /** Menu item selected handler */
  onMenuSelect?: (value: string) => void
  /** Visual variant */
  variant?: SplitButtonVariant
  /** Size */
  size?: SplitButtonSize
  /** Disabled state */
  disabled?: boolean
  /** Aria label for the dropdown toggle */
  dropdownAriaLabel?: string
}

const ArrowDropDownIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
)

export function SplitButton({
  label,
  icon,
  onClick,
  menuItems,
  onMenuSelect,
  variant = 'filled',
  size = 'm',
  disabled = false,
  dropdownAriaLabel = 'Show more options',
}: SplitButtonProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  // Close menu on outside click
  useEffect(() => {
    if (!menuOpen) return
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  // Close on Escape
  useEffect(() => {
    if (!menuOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [menuOpen])

  const handleMenuItemClick = (value: string) => {
    onMenuSelect?.(value)
    setMenuOpen(false)
  }

  return (
    <div className={`m3-split-button m3-split-button--${variant} m3-split-button--${size}`} ref={containerRef}>
      {/* Primary action */}
      <button
        className="m3-split-button__primary"
        onClick={onClick}
        disabled={disabled}
        type="button"
      >
        <Ripple />
        {icon && <span className="m3-split-button__icon" aria-hidden="true">{icon}</span>}
        <span className="m3-split-button__label">{label}</span>
      </button>

      {/* Divider */}
      <span className="m3-split-button__divider" aria-hidden="true" />

      {/* Dropdown toggle */}
      <button
        className={`m3-split-button__toggle ${menuOpen ? 'm3-split-button__toggle--open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        disabled={disabled}
        type="button"
        aria-label={dropdownAriaLabel}
        aria-expanded={menuOpen}
        aria-haspopup="menu"
      >
        <Ripple />
        <span className="m3-split-button__arrow" aria-hidden="true">{ArrowDropDownIcon}</span>
      </button>

      {/* Dropdown menu */}
      {menuOpen && (
        <ul className="m3-split-button__menu" role="menu">
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                className="m3-split-button__menu-item"
                onClick={() => handleMenuItemClick(item.value)}
                disabled={item.disabled}
                role="menuitem"
                type="button"
              >
                <Ripple />
                {item.icon && <span className="m3-split-button__menu-icon" aria-hidden="true">{item.icon}</span>}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
