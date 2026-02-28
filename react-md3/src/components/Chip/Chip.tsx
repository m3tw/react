import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Chip.css'

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion'

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: ReactNode
  selected?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  variant?: ChipVariant
}

export function Chip({
  label,
  selected = false,
  dismissible = false,
  variant = 'assist',
  onDismiss,
  disabled,
  onClick,
  className,
  ...props
}: ChipProps) {
  return (
    <span className={['m3-chip', `m3-chip--${variant}`, selected ? 'm3-chip--selected' : '', disabled ? 'm3-chip--disabled' : '', className ?? ''].filter(Boolean).join(' ')}>
      <button
        {...props}
        aria-pressed={selected ? 'true' : 'false'}
        className="m3-chip__button"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <Ripple />
        <span className="m3-chip__label">{label}</span>
      </button>
      {dismissible ? (
        <button
          aria-label={`${label} entfernen`}
          className="m3-chip__dismiss"
          disabled={disabled}
          onClick={onDismiss}
          type="button"
        >
          <Ripple />
          <span className="m3-chip__icon">×</span>
        </button>
      ) : null}
    </span>
  )
}
