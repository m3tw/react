import { useMemo, useState } from 'react'
import { Ripple } from "../Ripple";

import './List.css'

type ListItem = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
}

type ListProps = {
  items: readonly ListItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
}

const getFirstSelectableValue = (items: readonly ListItem[]) =>
  items.find((item) => !item.disabled)?.value

const isSelectableValue = (items: readonly ListItem[], selectedValue: string | undefined) =>
  items.some((item) => item.value === selectedValue && !item.disabled)

export function List({
  items,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'List',
}: ListProps) {
  const visibleItems = useMemo(
    () => items.filter((item) => !item.hidden),
    [items],
  )
  const firstSelectableValue = useMemo(() => getFirstSelectableValue(visibleItems), [visibleItems])
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    isSelectableValue(visibleItems, defaultValue) ? defaultValue : firstSelectableValue,
  )
  const activeValue = isControlled ? value : internalValue

  const selectItem = (item: ListItem) => {
    if (item.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(item.value)
    }

    onValueChange?.(item.value)
  }

  return (
    <ul aria-label={ariaLabel} className="m3-list" role="listbox">
      {visibleItems.map((item) => {
        const isActive = activeValue === item.value
        return (
          <li key={item.value} className="m3-list__item-container">
            <button
              aria-selected={isActive ? 'true' : 'false'}
              className={['m3-list__item', isActive ? 'm3-list__item--active' : '', item.disabled ? 'm3-list__item--disabled' : '']
                .filter(Boolean)
                .join(' ')}
              disabled={item.disabled}
              onClick={() => selectItem(item)}
              role="option"
              type="button"
            >
              <Ripple />
              <span className="m3-list__item-text">{item.label}</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
