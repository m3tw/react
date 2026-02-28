import type { ButtonHTMLAttributes } from 'react'

import './Chip.css'

type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: string
  selected?: boolean
  dismissible?: boolean
  onDismiss?: () => void
}

export function Chip({
  label,
  selected = false,
  dismissible = false,
  onDismiss,
  disabled,
  onClick,
  ...props
}: ChipProps) {
  return (
    <span className="m3-chip">
      <button
        {...props}
        aria-pressed={selected ? 'true' : 'false'}
        className={['m3-chip__button', selected ? 'm3-chip__button--selected' : ''].filter(Boolean).join(' ')}
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        {label}
      </button>
      {dismissible ? (
        <button
          aria-label={`${label} entfernen`}
          className="m3-chip__dismiss"
          disabled={disabled}
          onClick={onDismiss}
          type="button"
        >
          ×
        </button>
      ) : null}
    </span>
  )
}
