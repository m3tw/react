import { useState, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Button.css'

export type ButtonVariant = 'elevated' | 'filled' | 'tonal' | 'outlined' | 'text'
export type ButtonSize = 'xs' | 's' | 'm' | 'l' | 'xl'
export type ButtonShape = 'round' | 'square'

type BaseButtonProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> & {
  children: ReactNode
  loading?: boolean
  variant?: ButtonVariant
  /** Size: xs(32dp) s(40dp) m(56dp) l(96dp) xl(136dp) */
  size?: ButtonSize
  /** Shape: round (pill) or square (rounded corners) */
  shape?: ButtonShape
  /** Leading icon */
  icon?: ReactNode
}

type DefaultButtonProps = BaseButtonProps & {
  toggle?: false
  selected?: never
  defaultSelected?: never
  onSelectedChange?: never
}

type ToggleButtonProps = BaseButtonProps & {
  /** Enable toggle mode */
  toggle: true
  /** Controlled selected state */
  selected?: boolean
  /** Uncontrolled default selected */
  defaultSelected?: boolean
  /** Callback when toggled */
  onSelectedChange?: (selected: boolean) => void
}

export type ButtonProps = DefaultButtonProps | ToggleButtonProps

export function Button({
  children,
  className,
  disabled,
  loading = false,
  type = 'button',
  variant = 'filled',
  size = 's',
  shape = 'round',
  icon,
  ...rest
}: ButtonProps) {
  const {
    toggle,
    selected: controlledSelected,
    defaultSelected = false,
    onSelectedChange,
    onClick,
    ...props
  } = rest as ToggleButtonProps & { onClick?: React.MouseEventHandler<HTMLButtonElement> }

  const [uncontrolledSelected, setUncontrolledSelected] = useState(defaultSelected)
  const isToggle = toggle === true
  const isSelected = isToggle
    ? (controlledSelected !== undefined ? controlledSelected : uncontrolledSelected)
    : false

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isToggle) {
      const next = !isSelected
      if (controlledSelected === undefined) setUncontrolledSelected(next)
      onSelectedChange?.(next)
    }
    onClick?.(e)
  }

  const isDisabled = disabled || loading
  const classes = [
    'm3-button',
    `m3-button--${variant}`,
    `m3-button--${size}`,
    `m3-button--${shape}`,
    isToggle && isSelected ? 'm3-button--selected' : '',
    loading ? 'm3-button--loading' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button
      {...props}
      aria-busy={loading ? 'true' : undefined}
      aria-pressed={isToggle ? isSelected : undefined}
      className={classes}
      data-variant={variant}
      disabled={isDisabled}
      onClick={handleClick}
      type={type}
    >
      <Ripple />
      {icon && <span className="m3-button__icon" aria-hidden="true">{icon}</span>}
      <span className="m3-button__label">{children}</span>
    </button>
  )
}
