import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Fab.css'

export type FabVariant = 'regular' | 'extended'
export type FabColor = 'surface' | 'primary' | 'secondary' | 'tertiary'
export type FabSize = 'small' | 'medium' | 'large'

export type FabMenuItem = {
  label: string
  value: string
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
  return (
    <div className={`m3-fab-group ${className ?? ''}`}>
      <button
        {...props}
        className={['m3-fab', `m3-fab--${variant}`, `m3-fab--${color}`, `m3-fab--${size}`].filter(Boolean).join(' ')}
        disabled={disabled}
        onClick={onClick}
        type="button"
        aria-label={variant === 'extended' ? undefined : label}
      >
        <Ripple />
        <span aria-hidden="true" className="m3-fab__icon">
          {icon}
        </span>
        {variant === 'extended' ? <span className="m3-fab__label">{label}</span> : null}
      </button>
      {menuItems.length > 0 ? (
        <ul className="m3-fab__menu" role="menu">
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                className="m3-fab__menu-item m3-fab m3-fab--regular m3-fab--small m3-fab--surface"
                disabled={disabled || item.disabled}
                onClick={() => onMenuSelect?.(item.value)}
                role="menuitem"
                type="button"
              >
                <Ripple />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
