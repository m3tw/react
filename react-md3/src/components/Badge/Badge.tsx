import './Badge.css'

type BadgeTone = 'neutral' | 'success' | 'warning' | 'error'

type BadgeProps = {
  label: string
  tone?: BadgeTone
  hidden?: boolean
}

export function Badge({ label, tone = 'neutral', hidden = false }: BadgeProps) {
  if (hidden) {
    return null
  }

  return (
    <span aria-label={`${label} Badge`} className={['m3-badge', `m3-badge--${tone}`].join(' ')} role="status">
      {label}
    </span>
  )
}
