import React, { type ReactNode } from 'react'
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
  /** Optional container tracking scroll, defaults to browser window. Required for flex collapsing variants if page structure is nested */
  scrollTarget?: React.RefObject<HTMLElement | null> | Window
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
  scrollTarget,
}: TopAppBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden)

  const isCompact = variant === 'small' || variant === 'center-aligned'
  const isFlexible = variant === 'medium' || variant === 'large'

  // Scroll tracking state
  const [scrollRange, setScrollRange] = React.useState(0) // 0 to 1 (0 = expanded, 1 = fully collapsed)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    // Determine the DOM node or default to window
    const target = (scrollTarget && 'current' in scrollTarget ? scrollTarget.current : scrollTarget) || window
    if (!target) return

    // Calculate maximum scroll distance required to fully collapse
    // Medium spans 112dp to 64dp (diff: 48)
    // Large spans 152dp to 64dp (diff: 88)
    const maxScroll = variant === 'large' ? 88 : 48

    const handleScroll = () => {
      // Safely extract scrollTop based on window vs generic element
      const y = target === window ? window.scrollY : (target as HTMLElement).scrollTop
      
      setIsScrolled(y > 0)
      
      if (isFlexible) {
        // Clamp scroll amount between 0 and 1
        const ratio = Math.max(0, Math.min(1, y / maxScroll))
        setScrollRange(ratio)
      }
    }

    target.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // initial check

    return () => target.removeEventListener('scroll', handleScroll)
  }, [variant, isFlexible, scrollTarget])

  // Map the 0->1 range into visual styles
  // The headline container shrinks, fades, and pushes up
  const headlineStyle = isFlexible ? {
    opacity: 1 - scrollRange * 1.5, // Fades out slightly faster than the distance
    transform: `translateY(-${scrollRange * 16}px)`, // Slight upward parallax
  } : {}

  // The inline titles (which appear when fully collapsed) fade in
  const inlineTitleStyle = isFlexible ? {
    opacity: scrollRange,
  } : {}

  return (
    <header
      aria-label={ariaLabel}
      className={[
        'm3-top-app-bar',
        `m3-top-app-bar--${variant}`,
        isScrolled && 'm3-top-app-bar--scrolled',
        isFlexible && scrollRange === 1 && 'm3-top-app-bar--collapsed'
      ].filter(Boolean).join(' ')}
      style={{
        // Dynamically adjust height of the whole bar via CSS Variables during scroll frame
        ...(isFlexible && {
           '--m3-top-app-bar-collapse-ratio': scrollRange,
        } as React.CSSProperties)
      }}
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

        {/* Title area — inline for small/center-aligned AND fully collapsed flexible variants */}
        <div 
          className="m3-top-app-bar__titles"
          style={inlineTitleStyle}
        >
          <h2 className="m3-top-app-bar__title">{title}</h2>
          {supportingText && isCompact ? (
            <p className="m3-top-app-bar__supporting-text">{supportingText}</p>
          ) : null}
        </div>

        {/* Spacer pushes actions to the right */}
        <div className="m3-top-app-bar__spacer" />

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
        <div className="m3-top-app-bar__headline-wrapper">
          <div className="m3-top-app-bar__headline" style={headlineStyle}>
            <h2 className="m3-top-app-bar__title">{title}</h2>
            {supportingText ? (
              <p className="m3-top-app-bar__supporting-text">{supportingText}</p>
            ) : null}
          </div>
        </div>
      )}
    </header>
  )
}
