import { useMemo, useState } from 'react'

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
      {visibleItems.map((item) => (
        <li key={item.value}>
          <button
            aria-selected={activeValue === item.value ? 'true' : 'false'}
            className={['m3-list__item', activeValue === item.value ? 'm3-list__item--active' : '']
              .filter(Boolean)
              .join(' ')}
            disabled={item.disabled}
            onClick={() => selectItem(item)}
            role="option"
            type="button"
          >
            {item.label}
          </button>
        </li>
      ))}
    </ul>
  )
}
