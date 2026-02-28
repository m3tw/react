import { useMemo, useRef, useState } from 'react'
import { Ripple } from "../Ripple";

import './NavigationRail.css'

type NavigationRailDestination = {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  hidden?: boolean
}

type NavigationRailProps = {
  destinations: readonly NavigationRailDestination[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  compact?: boolean
  ariaLabel?: string
}

const getFirstSelectableValue = (destinations: readonly NavigationRailDestination[]) =>
  destinations.find((destination) => !destination.disabled)?.value

const isSelectableValue = (
  destinations: readonly NavigationRailDestination[],
  selectedValue: string | undefined,
) => destinations.some((destination) => destination.value === selectedValue && !destination.disabled)

export function NavigationRail({
  destinations,
  value,
  defaultValue,
  onValueChange,
  compact = false,
  ariaLabel = 'Navigation Rail',
}: NavigationRailProps) {
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
  const buttonRefs = useRef<Array<HTMLButtonElement | null>>([])

  const activeValue = isControlled ? value : internalValue

  const selectDestination = (destination: NavigationRailDestination) => {
    if (destination.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(destination.value)
    }
    onValueChange?.(destination.value)
  }

  const moveSelection = (currentIndex: number, direction: 1 | -1) => {
    if (visibleDestinations.length === 0) {
      return
    }

    for (let offset = 1; offset <= visibleDestinations.length; offset += 1) {
      const nextIndex =
        (currentIndex + direction * offset + visibleDestinations.length) %
        visibleDestinations.length
      const candidate = visibleDestinations[nextIndex]
      if (candidate.disabled) {
        continue
      }

      selectDestination(candidate)
      buttonRefs.current[nextIndex]?.focus()
      return
    }
  }

  const moveToBoundary = (direction: 1 | -1) => {
    const boundaryDestination =
      direction === 1
        ? [...visibleDestinations].reverse().find((destination) => !destination.disabled)
        : visibleDestinations.find((destination) => !destination.disabled)

    if (!boundaryDestination) {
      return
    }

    selectDestination(boundaryDestination)
    const boundaryIndex = visibleDestinations.findIndex(
      (destination) => destination.value === boundaryDestination.value,
    )
    buttonRefs.current[boundaryIndex]?.focus()
  }

  return (
    <nav
      aria-label={ariaLabel}
      className={['m3-navigation-rail', compact ? 'm3-navigation-rail--compact' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <ul className="m3-navigation-rail__list">
        {visibleDestinations.map((destination, index) => {
          const isActive = activeValue === destination.value
          return (
            <li className="m3-navigation-rail__item" key={destination.value}>
              <button
                aria-current={isActive ? 'page' : undefined}
                className={[
                  'm3-navigation-rail__destination',
                  compact ? 'm3-navigation-rail__destination--compact' : '',
                  isActive ? 'm3-navigation-rail__destination--active' : '',
                  destination.disabled ? 'm3-navigation-rail__destination--disabled' : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                disabled={destination.disabled}
                onClick={() => selectDestination(destination)}
                onKeyDown={(event) => {
                  if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                    event.preventDefault()
                    moveSelection(index, 1)
                  }

                  if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                    event.preventDefault()
                    moveSelection(index, -1)
                  }

                  if (event.key === 'Home') {
                    event.preventDefault()
                    moveToBoundary(-1)
                  }

                  if (event.key === 'End') {
                    event.preventDefault()
                    moveToBoundary(1)
                  }
                }}
                ref={(element) => {
                  buttonRefs.current[index] = element
                }}
                type="button"
              >
                <div className="m3-navigation-rail__indicator">
                  <Ripple />
                  {destination.icon ? <span className="m3-navigation-rail__icon">{destination.icon}</span> : null}
                </div>
                <span className="m3-navigation-rail__label">{destination.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
