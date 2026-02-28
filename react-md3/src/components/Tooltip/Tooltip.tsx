import './Tooltip.css'

type TooltipPosition = 'top' | 'bottom'

type TooltipProps = {
  label: string
  content: string
  open?: boolean
  position?: TooltipPosition
}

export function Tooltip({
  label,
  content,
  open = true,
  position = 'top',
}: TooltipProps) {
  return (
    <span className="m3-tooltip-anchor">
      <span className="m3-tooltip-anchor__label">{label}</span>
      {open ? (
        <span className={['m3-tooltip', `m3-tooltip--${position}`].join(' ')} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  )
}
