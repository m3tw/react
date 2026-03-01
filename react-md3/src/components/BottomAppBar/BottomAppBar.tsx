import { type ReactNode } from 'react'
import { IconButton } from '../IconButton'
import './BottomAppBar.css'

type BottomAppBarAction = {
  label: string
  icon?: ReactNode
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
}

type BottomAppBarProps = {
  /** Trailing action icons */
  actions?: readonly BottomAppBarAction[]
  /** Optional FAB (Floating Action Button) to render inside or floating above the bar */
  fab?: ReactNode
  ariaLabel?: string
  /** Leading navigation icon (menu, back arrow, etc.) */
  navigationIcon?: ReactNode
  /** Click handler for the navigation icon */
  onNavigationClick?: () => void
  /** Navigation icon aria-label */
  navigationAriaLabel?: string
}

// Default fallback icon for actions
const MoreVertIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
  </svg>
)

export function BottomAppBar({
  actions = [],
  fab,
  ariaLabel = 'Bottom App Bar',
  navigationIcon,
  onNavigationClick,
  navigationAriaLabel = 'Open navigation',
}: BottomAppBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden)

  return (
    <div
      aria-label={ariaLabel}
      className="m3-bottom-app-bar"
      role="navigation"
    >
      <div className="m3-bottom-app-bar__container">
        {/* Navigation icon */}
        {navigationIcon !== undefined ? (
          <IconButton
            ariaLabel={navigationAriaLabel}
            className="m3-bottom-app-bar__nav-icon"
            icon={navigationIcon}
            onClick={onNavigationClick}
          />
        ) : null}

        {/* Action icons */}
        {visibleActions.length > 0 ? (
          <div className="m3-bottom-app-bar__actions">
            {visibleActions.map((action) => (
              <IconButton
                ariaLabel={action.label}
                className="m3-bottom-app-bar__action"
                disabled={action.disabled}
                icon={action.icon || MoreVertIcon}
                key={action.label}
                onClick={action.onClick}
              />
            ))}
          </div>
        ) : null}
        
        {/* Spacer pushes the FAB to the right */}
        <div className="m3-bottom-app-bar__spacer" />

        {/* FAB Node */}
        {fab !== undefined ? (
          <div className="m3-bottom-app-bar__fab-container">
            {fab}
          </div>
        ) : null}
      </div>
    </div>
  )
}
