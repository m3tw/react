import { createElement } from 'react'
import type { HTMLAttributes, ReactNode } from 'react'

import './Surface.css'

type SurfaceTag = 'div' | 'section' | 'article' | 'main' | 'aside'

type SurfaceProps = Omit<HTMLAttributes<HTMLElement>, 'children'> & {
  children: ReactNode
  as?: SurfaceTag
  elevation?: 0 | 1 | 2 | 3
  tonal?: boolean
}

export function Surface({
  children,
  as = 'div',
  elevation = 1,
  tonal = false,
  className,
  ...props
}: SurfaceProps) {
  return createElement(
    as,
    {
      ...props,
      className: ['m3-surface', `m3-surface--elevation-${elevation}`, tonal ? 'm3-surface--tonal' : '', className ?? '']
        .filter(Boolean)
        .join(' '),
    },
    children,
  )
}
