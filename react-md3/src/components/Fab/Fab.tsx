import type { ButtonHTMLAttributes } from 'react'

import './Fab.css'

type FabVariant = 'regular' | 'extended'

type FabMenuItem = {
  label: string
  value: string
  disabled?: boolean
}

type FabProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  icon?: string
  variant?: FabVariant
  menuItems?: readonly FabMenuItem[]
  onMenuSelect?: (value: string) => void
}

export function Fab({
  label,
  icon = '+',
  variant = 'regular',
  menuItems = [],
  disabled,
  onClick,
  onMenuSelect,
  ...props
}: FabProps) {
  return (
    <div className="m3-fab-group">
      <button
        {...props}
        className={['m3-fab', `m3-fab--${variant}`].join(' ')}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <span aria-hidden="true" className="m3-fab__icon">
          {icon}
        </span>
        {variant === 'extended' ? <span>{label}</span> : null}
      </button>
      {menuItems.length > 0 ? (
        <ul className="m3-fab__menu" role="menu">
          {menuItems.map((item) => (
            <li key={item.value}>
              <button
                className="m3-fab__menu-item"
                disabled={disabled || item.disabled}
                onClick={() => onMenuSelect?.(item.value)}
                role="menuitem"
                type="button"
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
