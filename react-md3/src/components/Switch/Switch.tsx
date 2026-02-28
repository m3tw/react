import { useState } from 'react'
import { Ripple } from "../Ripple";

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
      className={['m3-switch', isChecked ? 'm3-switch--checked' : '', disabled ? 'm3-switch--disabled' : ''].filter(Boolean).join(' ')}
      disabled={disabled}
      onClick={toggle}
      role="switch"
      type="button"
    >
      <div className="m3-switch__track">
        <div className="m3-switch__thumb-container">
          <div className="m3-switch__ripple">
            <Ripple />
          </div>
          <div className="m3-switch__thumb">
            {/* Optional M3 Icons inside thumb */}
            <svg className="m3-switch__icon m3-switch__icon--on" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
            <svg className="m3-switch__icon m3-switch__icon--off" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
            </svg>
          </div>
        </div>
      </div>
    </button>
  )
}
