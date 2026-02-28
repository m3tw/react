import './Divider.css'

type DividerOrientation = 'horizontal' | 'vertical'

type DividerProps = {
  orientation?: DividerOrientation
}

export function Divider({ orientation = 'horizontal' }: DividerProps) {
  return (
    <div
      aria-orientation={orientation}
      className={['m3-divider', orientation === 'vertical' ? 'm3-divider--vertical' : '']
        .filter(Boolean)
        .join(' ')}
      role="separator"
    />
  )
}
