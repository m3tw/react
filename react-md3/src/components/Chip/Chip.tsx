import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Chip.css'

export type ChipVariant = 'assist' | 'filter' | 'input' | 'suggestion'

export type ChipProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  label: ReactNode
  leadingElement?: ReactNode
  selected?: boolean
  dismissible?: boolean
  onDismiss?: () => void
  variant?: ChipVariant
}

export function Chip({
  label,
  leadingElement,
  selected = false,
  dismissible = false,
  variant = 'assist',
  onDismiss,
  disabled,
  onClick,
  className,
  ...props
}: ChipProps) {
  
  // Natively render standard M3 checkmark if it's a selected filter chip
  const defaultFilterCheckmark = (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" data-testid="m3-filter-checkmark">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )

  const internalLeadingElement = (variant === 'filter' && selected && !leadingElement) 
    ? defaultFilterCheckmark 
    : leadingElement

  const hasLeading = !!internalLeadingElement
  const hasTrailing = dismissible

  return (
    <span 
      className={[
        'm3-chip', 
        `m3-chip--${variant}`, 
        selected ? 'm3-chip--selected' : '', 
        disabled ? 'm3-chip--disabled' : '', 
        hasLeading ? 'm3-chip--has-leading' : '',
        hasTrailing ? 'm3-chip--has-trailing' : '',
        className ?? ''
      ].filter(Boolean).join(' ')}
    >
      <button
        {...props}
        aria-pressed={selected ? 'true' : 'false'}
        className="m3-chip__button"
        disabled={disabled}
        onClick={onClick}
        type="button"
      >
        <Ripple />
        {internalLeadingElement && (
          <span className="m3-chip__leading-element" aria-hidden="true">
            {internalLeadingElement}
          </span>
        )}
        <span className="m3-chip__label">{label}</span>
      </button>
      
      {dismissible && (
        <button
          aria-label={`${label} entfernen`}
          className="m3-chip__dismiss"
          disabled={disabled}
          onClick={onDismiss}
          type="button"
        >
          <Ripple />
          <span className="m3-chip__icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </span>
        </button>
      )}
    </span>
  )
}
