import { useState } from 'react'
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
  open: controlledOpen,
  position = 'top',
}: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  
  const open = controlledOpen !== undefined ? controlledOpen : (isHovered || isFocused)

  return (
    <span 
      className="m3-tooltip-anchor"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      <span className="m3-tooltip-anchor__label">{label}</span>
      {open ? (
        <span className={['m3-tooltip', `m3-tooltip--${position}`].join(' ')} role="tooltip">
          {content}
        </span>
      ) : null}
    </span>
  )
}
