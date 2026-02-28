import type { ReactNode } from 'react'

import './Sheet.css'

type SheetPlacement = 'center' | 'bottom' | 'side'

type SheetProps = {
  title: string
  placement?: SheetPlacement
  open?: boolean
  children?: ReactNode
}

export function Sheet({ title, placement = 'center', open = true, children }: SheetProps) {
  if (!open) {
    return null
  }

  return (
    <section aria-label={`${title} Sheet`} className={['m3-sheet', `m3-sheet--${placement}`].join(' ')} role="region">
      <h3 className="m3-sheet__title">{title}</h3>
      {children ? <div className="m3-sheet__content">{children}</div> : null}
    </section>
  )
}
