import type { ButtonHTMLAttributes, ReactNode } from 'react'

import './Button.css'

type ButtonVariant = 'filled' | 'tonal' | 'text'

type ButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode
  loading?: boolean
  variant?: ButtonVariant
}

export function Button({
  children,
  className,
  disabled,
  loading = false,
  type = 'button',
  variant = 'filled',
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading
  const classes = [
    'm3-button',
    `m3-button--${variant}`,
    loading ? 'm3-button--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...props}
      aria-busy={loading ? 'true' : undefined}
      className={classes}
      data-variant={variant}
      disabled={isDisabled}
      type={type}
    >
      <span className="m3-button__label">{children}</span>
    </button>
  )
}
