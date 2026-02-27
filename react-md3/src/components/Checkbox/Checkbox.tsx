import type { InputHTMLAttributes } from 'react'
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
      className={['m3-checkbox', hasError ? 'm3-checkbox--error' : '', disabled ? 'm3-checkbox--disabled' : '']
        .filter(Boolean)
        .join(' ')}
    >
      <label className="m3-checkbox__label" htmlFor={inputId}>
        <input
          {...props}
          aria-describedby={describedBy || undefined}
          aria-invalid={hasError ? 'true' : undefined}
          className={['m3-checkbox__input', className ?? ''].filter(Boolean).join(' ')}
          disabled={disabled}
          id={inputId}
          onChange={(event) => {
            if (!disabled) {
              onChange?.(event)
            }
          }}
          type="checkbox"
        />
        <span>{label}</span>
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
