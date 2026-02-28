import './Menu.css'
import { Ripple } from "../Ripple";

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
  return (
    <div aria-label={ariaLabel} className="m3-menu" role="menu">
      <div className="m3-menu__content">
        {items.map((item) => (
          <button
            className={['m3-menu__item', item.disabled ? 'm3-menu__item--disabled' : ''].filter(Boolean).join(' ')}
            disabled={item.disabled}
            key={item.value}
            onClick={() => onSelect?.(item.value)}
            role="menuitem"
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
