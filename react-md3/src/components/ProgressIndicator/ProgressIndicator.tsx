import './ProgressIndicator.css'

type ProgressIndicatorProps = {
  label?: string
  value?: number
  indeterminate?: boolean
}

const clampValue = (value: number) => {
  if (value < 0) {
    return 0
  }

  if (value > 100) {
    return 100
  }

  return value
}

export function ProgressIndicator({
  label = 'Fortschritt',
  value,
  indeterminate = false,
}: ProgressIndicatorProps) {
  const isIndeterminate = indeterminate || value === undefined
  const normalizedValue = value === undefined ? 0 : clampValue(value)

  return (
    <div aria-label={label} className="m3-progress-indicator" role="progressbar" aria-valuemin={0} aria-valuemax={100}
      aria-valuenow={isIndeterminate ? undefined : normalizedValue}
      aria-valuetext={isIndeterminate ? 'Ladevorgang' : `${normalizedValue}%`}
    >
      <span className="m3-progress-indicator__track">
        <span
          className={[
            'm3-progress-indicator__fill',
            isIndeterminate ? 'm3-progress-indicator__fill--indeterminate' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={isIndeterminate ? undefined : { width: `${normalizedValue}%` }}
        />
      </span>
      <span className="m3-progress-indicator__label">{label}</span>
    </div>
  )
}
