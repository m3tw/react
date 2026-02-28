import { useState } from 'react'

import './Switch.css'

type SwitchProps = {
  label: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}

export function Switch({
  label,
  checked,
  defaultChecked = false,
  disabled = false,
  onCheckedChange,
}: SwitchProps) {
  const isControlled = checked !== undefined
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isChecked = isControlled ? checked : internalChecked

  const toggle = () => {
    if (disabled) {
      return
    }

    const nextChecked = !isChecked
    if (!isControlled) {
      setInternalChecked(nextChecked)
    }

    onCheckedChange?.(nextChecked)
  }

  return (
    <button
      aria-checked={isChecked ? 'true' : 'false'}
      aria-label={label}
      className={['m3-switch', isChecked ? 'm3-switch--checked' : ''].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={toggle}
      role="switch"
      type="button"
    >
      <span className="m3-switch__thumb" />
    </button>
  )
}
