import { type ReactNode } from 'react'
import { IconButton } from '../IconButton'
import './TopAppBar.css'

type TopAppBarAction = {
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
}

type TopAppBarVariant = 'small' | 'center-aligned' | 'medium' | 'large'

type TopAppBarProps = {
  title: string
  supportingText?: string
  actions?: readonly TopAppBarAction[]
  ariaLabel?: string
  /** Leading navigation icon (hamburger, back arrow, etc.) */
  navigationIcon?: ReactNode
  /** Click handler for the navigation icon */
  onNavigationClick?: () => void
  /** Navigation icon aria-label */
  navigationAriaLabel?: string
  /** M3 variant: 'small' | 'center-aligned' | 'medium' | 'large' */
  variant?: TopAppBarVariant
}

// Default fallback icon for actions without a custom icon
const MoreVertIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

export function TopAppBar({
  title,
  supportingText,
  actions = [],
  ariaLabel = 'Top App Bar',
  navigationIcon,
  onNavigationClick,
  navigationAriaLabel = 'Open navigation',
  variant = 'small',
}: TopAppBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden)

  const isCompact = variant === 'small' || variant === 'center-aligned'

  return (
    <header
      aria-label={ariaLabel}
      className={`m3-top-app-bar m3-top-app-bar--${variant}`}
    >
      <div className="m3-top-app-bar__row">
        {/* Navigation icon */}
        {navigationIcon !== undefined ? (
          <IconButton
            ariaLabel={navigationAriaLabel}
            className="m3-top-app-bar__nav-icon"
            icon={navigationIcon}
            onClick={onNavigationClick}
          />
        ) : null}

        {/* Title area — inline for small/center-aligned */}
        {isCompact && (
          <div className="m3-top-app-bar__titles">
            <h2 className="m3-top-app-bar__title">{title}</h2>
            {supportingText ? (
              <p className="m3-top-app-bar__supporting-text">{supportingText}</p>
            ) : null}
          </div>
        )}

        {/* Spacer pushes actions to the right */}
        {isCompact && <div className="m3-top-app-bar__spacer" />}

        {/* Trailing action icons */}
        {visibleActions.length > 0 ? (
          <div className="m3-top-app-bar__actions">
            {visibleActions.map((action) => (
              <IconButton
                ariaLabel={action.label}
                className="m3-top-app-bar__action"
                disabled={action.disabled}
                icon={action.icon || MoreVertIcon}
                key={action.label}
                onClick={action.onClick}
              />
            ))}
          </div>
        ) : null}
      </div>

      {/* Title below the row for medium/large variants */}
      {!isCompact && (
        <div className="m3-top-app-bar__headline">
          <h2 className="m3-top-app-bar__title">{title}</h2>
          {supportingText ? (
            <p className="m3-top-app-bar__supporting-text">{supportingText}</p>
          ) : null}
        </div>
      )}
    </header>
  )
}
