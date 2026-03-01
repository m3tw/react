import './ProgressIndicator.css'

export type ProgressIndicatorVariant = 'linear' | 'circular'

type ProgressIndicatorProps = {
  label?: string
  value?: number
  indeterminate?: boolean
  variant?: ProgressIndicatorVariant
}

const clampValue = (value: number) => {
  if (value < 0) return 0
  if (value > 100) return 100
  return value
}

export function ProgressIndicator({
  label = 'Fortschritt',
  value,
  indeterminate = false,
  variant = 'linear',
}: ProgressIndicatorProps) {
  const isIndeterminate = indeterminate || value === undefined
  const normalizedValue = value === undefined ? 0 : clampValue(value)

  // Circular math: radius 18, circumference ~113.097
  const circumference = 2 * Math.PI * 18
  const strokeDashoffset = isIndeterminate 
    ? undefined 
    : circumference - (normalizedValue / 100) * circumference

  return (
    <div 
      aria-label={label} 
      className={['m3-progress-indicator', `m3-progress-indicator--${variant}`].filter(Boolean).join(' ')} 
      role={isIndeterminate && variant === 'circular' ? 'status' : 'progressbar'} 
      // Only provide progressbar ARIA attributes if NOT a pure loading status
      {...(!(isIndeterminate && variant === 'circular') ? {
        'aria-valuemin': 0,
        'aria-valuemax': 100,
        'aria-valuenow': isIndeterminate ? undefined : normalizedValue,
        'aria-valuetext': isIndeterminate ? 'Ladevorgang' : `${normalizedValue}%`
      } : {
        'aria-live': 'polite'
      })}
    >
      {variant === 'linear' ? (
        <span className="m3-progress-indicator__track m3-progress-indicator__track--linear">
          <span
            className={[
              'm3-progress-indicator__fill',
              'm3-progress-indicator__fill--linear',
              isIndeterminate ? 'm3-progress-indicator__fill--linear-indeterminate' : '',
            ].filter(Boolean).join(' ')}
            style={isIndeterminate ? undefined : { width: `${normalizedValue}%` }}
          />
        </span>
      ) : (
        <div className="m3-progress-indicator__track m3-progress-indicator__track--circular">
          <svg 
            className={[
              'm3-progress-indicator__svg', 
              isIndeterminate ? 'm3-progress-indicator__svg--indeterminate' : ''
            ].filter(Boolean).join(' ')} 
            viewBox="0 0 40 40"
          >
            <circle 
              className="m3-progress-indicator__circle-track" 
              cx="20" cy="20" r="18" 
            />
            <circle 
              className={[
                'm3-progress-indicator__circle-fill',
                isIndeterminate ? 'm3-progress-indicator__circle-fill--indeterminate' : ''
              ].filter(Boolean).join(' ')}
              cx="20" cy="20" r="18"
              style={isIndeterminate ? undefined : { strokeDashoffset }}
            />
          </svg>
        </div>
      )}
      {label && <span className="m3-progress-indicator__label">{label}</span>}
    </div>
  )
}
