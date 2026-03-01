import './Menu.css'
import { Ripple } from "../Ripple";
import { useRef } from 'react';
import type { KeyboardEvent } from 'react';

type MenuItem = {
  label: string
  value: string
  disabled?: boolean
}

type MenuProps = {
  items: readonly MenuItem[]
  onSelect?: (value: string) => void
  ariaLabel?: string
}

export function Menu({ items, onSelect, ariaLabel = 'Menu' }: MenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!menuRef.current) return

    const getEnabledItems = () => {
      const elements = Array.from(menuRef.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]:not(:disabled)') || [])
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
      default:
        return
    }

    enabledItems[nextIndex]?.focus()
  }

  return (
    <div aria-label={ariaLabel} className="m3-menu" role="menu" ref={menuRef} onKeyDown={handleKeyDown}>
      <div className="m3-menu__content">
        {items.map((item) => (
          <button
            className={['m3-menu__item', item.disabled ? 'm3-menu__item--disabled' : ''].filter(Boolean).join(' ')}
            disabled={item.disabled}
            key={item.value}
            onClick={() => onSelect?.(item.value)}
            role="menuitem"
            tabIndex={item.disabled ? -1 : 0}
            type="button"
          >
            <Ripple />
            <span className="m3-menu__item-text">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
