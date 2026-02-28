import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './IconButton.css'

export type IconButtonVariant = 'filled' | 'tonal' | 'outlined' | 'standard'

export type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  ariaLabel: string
  icon?: ReactNode
  selected?: boolean
  variant?: IconButtonVariant
}

export function IconButton({
  ariaLabel,
  icon = '★',
  selected = false,
  variant = 'standard',
  className,
  ...props
}: IconButtonProps) {
  // Map selected to a default variant if variant isn't explicitly provided.
  // M3 uses tonal for selected standard icon buttons generally, but we'll use a data attribute for styling.
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-pressed={selected ? 'true' : 'false'}
      data-variant={variant}
      className={['m3-icon-button', selected ? 'm3-icon-button--selected' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      type="button"
    >
      <Ripple />
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
