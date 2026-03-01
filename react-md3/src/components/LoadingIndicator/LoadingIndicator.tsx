import './LoadingIndicator.css'

export type LoadingIndicatorProps = {
  /** ARIA label for screen readers. Defaults to "Ladevorgang" (Loading). */
  label?: string
  /** 
   * 'standard' uses no explicit background containment shape.
   * 'contained' provides an explicit secondary container bubble behind the indicator.
   */
  variant?: 'standard' | 'contained'
}

export function LoadingIndicator({
  label = 'Ladevorgang',
  variant = 'standard',
}: LoadingIndicatorProps) {
  return (
    <div 
      className={['m3-loading-indicator', `m3-loading-indicator--${variant}`].filter(Boolean).join(' ')}
      role="status"
      aria-label={label}
      aria-live="polite"
    >
      <div className="m3-loading-indicator__container">
        {/* The spinner element handles both rotation and the active clip-path shape morphing */}
        <div className="m3-loading-indicator__active-shape" />
      </div>
    </div>
  )
}
