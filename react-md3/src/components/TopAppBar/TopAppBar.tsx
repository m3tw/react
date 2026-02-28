import './TopAppBar.css'
import { Button } from "../Button";

type TopAppBarAction = {
  label: string
  onClick?: () => void
  disabled?: boolean
  hidden?: boolean
}

type TopAppBarProps = {
  title: string
  supportingText?: string
  actions?: readonly TopAppBarAction[]
  ariaLabel?: string
}

export function TopAppBar({
  title,
  supportingText,
  actions = [],
  ariaLabel = 'Top App Bar',
}: TopAppBarProps) {
  const visibleActions = actions.filter((action) => !action.hidden)

  return (
    <header aria-label={ariaLabel} className="m3-top-app-bar">
      <div className="m3-top-app-bar__titles">
        <h2 className="m3-top-app-bar__title">{title}</h2>
        {supportingText ? (
          <p className="m3-top-app-bar__supporting-text">{supportingText}</p>
        ) : null}
      </div>
      {visibleActions.length > 0 ? (
        <div className="m3-top-app-bar__actions">
          {visibleActions.map((action) => (
            <Button
              className="m3-top-app-bar__action"
              disabled={action.disabled}
              key={action.label}
              onClick={action.onClick}
              variant="text"
            >
              {action.label}
            </Button>
          ))}
        </div>
      ) : null}
    </header>
  )
}
