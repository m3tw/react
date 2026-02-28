import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Fab.css'

export type FabVariant = 'regular' | 'extended'
export type FabColor = 'surface' | 'primary' | 'secondary' | 'tertiary'
export type FabSize = 'small' | 'medium' | 'large'

export type FabMenuItem = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
}

export type FabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  icon?: ReactNode
  variant?: FabVariant
  color?: FabColor
  size?: FabSize
  menuItems?: readonly FabMenuItem[]
  onMenuSelect?: (value: string) => void
}

export function Fab({
  label,
  icon = '+',
  variant = 'regular',
  color = 'primary',
  size = 'medium',
  menuItems = [],
  disabled,
  onClick,
  onMenuSelect,
  className,
  ...props
}: FabProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const hasMenu = menuItems.length > 0

  const handleMainClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasMenu) {
      setMenuOpen(!menuOpen)
    }
    onClick?.(e)
  }

  const handleMenuItemClick = (value: string) => {
    onMenuSelect?.(value)
    setMenuOpen(false)
  }

  return (
    <div className={`m3-fab-group ${menuOpen ? 'm3-fab-group--open' : ''} ${className ?? ''}`}>
      {/* Scrim overlay when menu is open */}
      {menuOpen && (
        <div className="m3-fab-group__scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />
      )}

      {/* Menu items (expand upward) */}
      {hasMenu && (
        <ul className={`m3-fab__menu ${menuOpen ? 'm3-fab__menu--open' : ''}`} role="menu">
          {menuItems.map((item, index) => (
            <li
              key={item.value}
              className="m3-fab__menu-item-row"
              style={{ '--fab-item-index': menuItems.length - 1 - index } as React.CSSProperties}
            >
              <span className="m3-fab__menu-item-label">{item.label}</span>
              <button
                className="m3-fab__menu-item m3-fab m3-fab--regular m3-fab--small m3-fab--surface"
                disabled={disabled || item.disabled}
                onClick={() => handleMenuItemClick(item.value)}
                role="menuitem"
                type="button"
                aria-label={item.label}
              >
                <Ripple />
                <span className="m3-fab__icon" aria-hidden="true">
                  {item.icon || '+'}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Main FAB */}
      <button
        {...props}
        className={[
          'm3-fab',
          `m3-fab--${variant}`,
          `m3-fab--${color}`,
          `m3-fab--${size}`,
          menuOpen ? 'm3-fab--menu-open' : '',
        ].filter(Boolean).join(' ')}
        disabled={disabled}
        onClick={handleMainClick}
        type="button"
        aria-label={variant === 'extended' ? undefined : label}
        aria-expanded={hasMenu ? menuOpen : undefined}
        aria-haspopup={hasMenu ? 'menu' : undefined}
      >
        <Ripple />
        <span aria-hidden="true" className={`m3-fab__icon ${menuOpen ? 'm3-fab__icon--rotated' : ''}`}>
          {icon}
        </span>
        {variant === 'extended' ? <span className="m3-fab__label">{label}</span> : null}
      </button>
    </div>
  )
}
