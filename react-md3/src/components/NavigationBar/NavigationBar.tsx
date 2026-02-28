import { useMemo, useState } from 'react'

import './NavigationBar.css'

type NavigationBarDestination = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
}

type NavigationBarProps = {
  destinations: readonly NavigationBarDestination[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
}

const getFirstSelectableValue = (destinations: readonly NavigationBarDestination[]) =>
  destinations.find((destination) => !destination.disabled)?.value

const isSelectableValue = (
  destinations: readonly NavigationBarDestination[],
  selectedValue: string | undefined,
) => destinations.some((destination) => destination.value === selectedValue && !destination.disabled)

export function NavigationBar({
  destinations,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Navigation Bar',
}: NavigationBarProps) {
  const visibleDestinations = useMemo(
    () => destinations.filter((destination) => !destination.hidden),
    [destinations],
  )
  const firstSelectableValue = useMemo(
    () => getFirstSelectableValue(visibleDestinations),
    [visibleDestinations],
  )
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    isSelectableValue(visibleDestinations, defaultValue) ? defaultValue : firstSelectableValue,
  )
  const activeValue = isControlled ? value : internalValue

  const selectDestination = (destination: NavigationBarDestination) => {
    if (destination.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(destination.value)
    }

    onValueChange?.(destination.value)
  }

  return (
    <nav aria-label={ariaLabel} className="m3-navigation-bar">
      {visibleDestinations.map((destination) => {
        const isActive = activeValue === destination.value
        return (
          <button
            aria-current={isActive ? 'page' : undefined}
            className={[
              'm3-navigation-bar__button',
              isActive ? 'm3-navigation-bar__button--active' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            disabled={destination.disabled}
            key={destination.value}
            onClick={() => selectDestination(destination)}
            type="button"
          >
            {destination.label}
          </button>
        )
      })}
    </nav>
  )
}
