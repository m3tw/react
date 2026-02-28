import './Menu.css'

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
      {items.map((item) => (
        <button
          className="m3-menu__item"
          disabled={item.disabled}
          key={item.value}
          onClick={() => onSelect?.(item.value)}
          role="menuitem"
          type="button"
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
