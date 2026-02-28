import type { HTMLAttributes, ReactNode } from 'react'
import { Ripple } from '../Ripple'

import './Card.css'

export type CardVariant = 'elevated' | 'filled' | 'outlined'

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  /** Defaults to elevated */
  variant?: CardVariant
  /** Makes the card focusable, hoverable, and adds a ripple effect on click */
  interactive?: boolean
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

export function Card({
  children,
  className,
  variant = 'elevated',
  interactive = false,
  onClick,
  ...props
}: CardProps) {
  const isInteractive = interactive || !!onClick

  const classes = [
    'm3-card',
    `m3-card--${variant}`,
    isInteractive ? 'm3-card--interactive' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (isInteractive && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick?.(e as unknown as React.MouseEvent<HTMLDivElement>)
    }
    props.onKeyDown?.(e)
  }

  return (
    <div
      {...props}
      className={classes}
      data-variant={variant}
      onClick={isInteractive ? onClick : undefined}
      onKeyDown={isInteractive ? handleKeyDown : props.onKeyDown}
      role={isInteractive ? 'button' : props.role || 'region'}
      tabIndex={isInteractive ? 0 : props.tabIndex}
    >
      {isInteractive && <Ripple />}
      <div className="m3-card__content">{children}</div>
    </div>
  )
}
