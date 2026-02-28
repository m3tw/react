import type { InputHTMLAttributes } from 'react'
import { Ripple } from "../Ripple";
import { useId } from 'react'

import './Checkbox.css'

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label: string
  errorText?: string
  supportingText?: string
}

export function Checkbox({
  label,
  id,
  className,
  disabled = false,
  errorText,
  supportingText,
  onChange,
  checked,
  'aria-describedby': ariaDescribedBy,
  ...props
}: CheckboxProps) {
  const fallbackId = useId()
  const inputId = id ?? `m3-checkbox-${fallbackId}`
  const messageId = `${inputId}-message`
  const message = errorText ?? supportingText
  const hasError = Boolean(errorText)
  const describedBy = [ariaDescribedBy, message ? messageId : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={['m3-checkbox', hasError ? 'm3-checkbox--error' : '', disabled ? 'm3-checkbox--disabled' : '', className ?? '']
        .filter(Boolean)
        .join(' ')}
    >
      <label className="m3-checkbox__label" htmlFor={inputId}>
        <div className="m3-checkbox__container">
          <input
            {...props}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError ? 'true' : undefined}
            className="m3-checkbox__input"
            disabled={disabled}
            id={inputId}
            checked={checked}
            onChange={(event) => {
              if (!disabled) {
                onChange?.(event)
              }
            }}
            type="checkbox"
          />
          <div className="m3-checkbox__visual">
            <Ripple />
            <div className="m3-checkbox__background">
              <svg 
                className="m3-checkbox__icon" 
                viewBox="0 0 24 24" 
                aria-hidden="true"
              >
                <path 
                  className="m3-checkbox__mark" 
                  fill="none" 
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" 
                />
              </svg>
            </div>
          </div>
        </div>
        <span className="m3-checkbox__label-text">{label}</span>
      </label>
      {message ? (
        <p
          className={['m3-checkbox__supporting-text', hasError ? 'm3-checkbox__supporting-text--error' : '']
            .filter(Boolean)
            .join(' ')}
          id={messageId}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
    </div>
  )
}
