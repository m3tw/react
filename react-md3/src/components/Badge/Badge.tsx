import type { ReactElement } from 'react'

import './Badge.css'

type BadgeProps = {
  children: ReactElement
  label?: string
  hidden?: boolean
}

export function Badge({ children, label, hidden = false }: BadgeProps) {
  const isLarge = label !== undefined

  return (
    <span className="m3-badge-anchor">
      {children}
      {!hidden && (
        <span
          className={`m3-badge__indicator ${isLarge ? 'm3-badge__indicator--large' : 'm3-badge__indicator--small'}`}
          role="status"
          aria-label={isLarge ? label : 'New notification'}
        >
          {isLarge ? label : null}
        </span>
      )}
    </span>
  )
}
