import { useMemo, useState, useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Ripple } from "../Ripple";

import './List.css'

export type ListItem = {
  value: string
  headline: ReactNode
  supportingText?: ReactNode
  leadingElement?: ReactNode
  trailingElement?: ReactNode
  disabled?: boolean
  hidden?: boolean
}

export type ListProps = {
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
  const listRef = useRef<HTMLUListElement>(null)

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

  const handleKeyDown = (e: KeyboardEvent<HTMLUListElement>) => {
    if (!listRef.current) return

    const getEnabledItems = () => {
      const elements = Array.from(listRef.current?.querySelectorAll<HTMLDivElement>('[role="option"]:not([aria-disabled="true"])') || [])
      return elements
    }

    const enabledItems = getEnabledItems()
    if (enabledItems.length === 0) return

    const currentIndex = enabledItems.findIndex((el) => el === document.activeElement)
    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        nextIndex = currentIndex < enabledItems.length - 1 ? currentIndex + 1 : 0
        break
      case 'ArrowUp':
        e.preventDefault()
        nextIndex = currentIndex > 0 ? currentIndex - 1 : enabledItems.length - 1
        break
      case 'Home':
        e.preventDefault()
        nextIndex = 0
        break
      case 'End':
        e.preventDefault()
        nextIndex = enabledItems.length - 1
        break
      case 'Enter':
      case ' ':
        e.preventDefault()
        if (currentIndex !== -1) {
          enabledItems[currentIndex]?.click()
        }
        return
      default:
        return
    }

    enabledItems[nextIndex]?.focus()
  }

  return (
    <ul 
      aria-label={ariaLabel} 
      className="m3-list" 
      role="listbox" 
      ref={listRef} 
      onKeyDown={handleKeyDown}
      tabIndex={-1}
    >
      {visibleItems.map((item) => {
        const isActive = activeValue === item.value
        const hasSupportingText = !!item.supportingText
        
        return (
          <li key={item.value} className="m3-list__item-container">
            <div
              aria-selected={isActive ? 'true' : 'false'}
              aria-disabled={item.disabled ? 'true' : undefined}
              className={[
                'm3-list__item', 
                isActive ? 'm3-list__item--active' : '', 
                item.disabled ? 'm3-list__item--disabled' : '',
                hasSupportingText ? 'm3-list__item--multiline' : 'm3-list__item--single-line'
              ].filter(Boolean).join(' ')}
              onClick={() => selectItem(item)}
              role="option"
              tabIndex={item.disabled ? -1 : 0}
            >
              <Ripple />
              
              {item.leadingElement && (
                <div className="m3-list__item-leading">
                  {item.leadingElement}
                </div>
              )}
              
              <div className="m3-list__item-content">
                <span className="m3-list__item-headline">{item.headline}</span>
                {item.supportingText && (
                  <span className="m3-list__item-supporting-text">{item.supportingText}</span>
                )}
              </div>

              {item.trailingElement && (
                <div className="m3-list__item-trailing">
                  {item.trailingElement}
                </div>
              )}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
