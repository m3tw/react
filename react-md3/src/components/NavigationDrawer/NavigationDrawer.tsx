import { useMemo, useRef, useState } from 'react'

import './NavigationDrawer.css'

type NavigationDrawerDestination = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
}

type NavigationDrawerProps = {
  heading: string
  destinations: readonly NavigationDrawerDestination[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
}

const getFirstSelectableValue = (destinations: readonly NavigationDrawerDestination[]) =>
  destinations.find((destination) => !destination.disabled)?.value

const isSelectableValue = (
  destinations: readonly NavigationDrawerDestination[],
  selectedValue: string | undefined,
) => destinations.some((destination) => destination.value === selectedValue && !destination.disabled)

export function NavigationDrawer({
  heading,
  destinations,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Navigation Drawer',
}: NavigationDrawerProps) {
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

  const selectDestination = (destination: NavigationDrawerDestination) => {
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

  return (
    <aside aria-label={ariaLabel} className="m3-navigation-drawer">
      <p className="m3-navigation-drawer__heading">{heading}</p>
      <nav aria-label={`${heading} Ziele`} className="m3-navigation-drawer__nav">
        <ul className="m3-navigation-drawer__list">
          {visibleDestinations.map((destination, index) => {
            const isActive = activeValue === destination.value
            return (
              <li className="m3-navigation-drawer__item" key={destination.value}>
                <button
                  aria-current={isActive ? 'page' : undefined}
                  className={[
                    'm3-navigation-drawer__button',
                    isActive ? 'm3-navigation-drawer__button--active' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  disabled={destination.disabled}
                  onClick={() => selectDestination(destination)}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown') {
                      event.preventDefault()
                      moveSelection(index, 1)
                    }

                    if (event.key === 'ArrowUp') {
                      event.preventDefault()
                      moveSelection(index, -1)
                    }
                  }}
                  ref={(element) => {
                    buttonRefs.current[index] = element
                  }}
                  type="button"
                >
                  {destination.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </aside>
  )
}
