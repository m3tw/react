import type { ReactNode } from 'react'

import './DockedToolbar.css'

type DockedToolbarProps = {
  children: ReactNode
  color?: 'standard' | 'vibrant'
  ariaLabel?: string
  className?: string
}

export function DockedToolbar({
  children,
  color = 'standard',
  ariaLabel = 'Toolbar',
  className,
}: DockedToolbarProps) {
  return (
    <div
      role="toolbar"
      aria-label={ariaLabel}
      className={[
        'm3-docked-toolbar',
        color === 'vibrant' && 'm3-docked-toolbar--vibrant',
        className,
      ].filter(Boolean).join(' ')}
    >
      {children}
    </div>
  )
}
