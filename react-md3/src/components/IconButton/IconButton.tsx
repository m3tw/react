import type { ButtonHTMLAttributes } from 'react'

import './IconButton.css'

type IconButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  ariaLabel: string
  icon?: string
  selected?: boolean
}

export function IconButton({
  ariaLabel,
  icon = '★',
  selected = false,
  className,
  ...props
}: IconButtonProps) {
  return (
    <button
      {...props}
      aria-label={ariaLabel}
      aria-pressed={selected ? 'true' : 'false'}
      className={['m3-icon-button', selected ? 'm3-icon-button--selected' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
      type="button"
    >
      <span aria-hidden="true">{icon}</span>
    </button>
  )
}
