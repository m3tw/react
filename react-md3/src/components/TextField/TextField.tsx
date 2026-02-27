import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'

import './TextField.css'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> & {
  label: string
  errorText?: string
  supportingText?: string
}

export function TextField({
  label,
  id,
  className,
  disabled = false,
  errorText,
  supportingText,
  type = 'text',
  'aria-describedby': ariaDescribedBy,
  ...props
}: TextFieldProps) {
  const fallbackId = useId()
  const inputId = id ?? `m3-text-field-${fallbackId}`
  const messageId = `${inputId}-message`
  const message = errorText ?? supportingText
  const hasError = Boolean(errorText)
  const describedBy = [ariaDescribedBy, message ? messageId : undefined]
    .filter(Boolean)
    .join(' ')

  return (
    <div
      className={[
        'm3-text-field',
        hasError ? 'm3-text-field--error' : '',
        disabled ? 'm3-text-field--disabled' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <label className="m3-text-field__label" htmlFor={inputId}>
        {label}
      </label>
      <input
        {...props}
        aria-describedby={describedBy || undefined}
        aria-invalid={hasError ? 'true' : undefined}
        className={['m3-text-field__input', className ?? ''].filter(Boolean).join(' ')}
        disabled={disabled}
        id={inputId}
        type={type}
      />
      {message ? (
        <p
          className={['m3-text-field__supporting-text', hasError ? 'm3-text-field__supporting-text--error' : '']
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
