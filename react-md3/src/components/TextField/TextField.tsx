import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'

import './TextField.css'

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement>, 'size'> & {
  label: string
  errorText?: string
  supportingText?: string
  multiline?: boolean
  rows?: number
}

export function TextField({
  label,
  id,
  className,
  disabled = false,
  errorText,
  supportingText,
  multiline = false,
  rows = 3,
  type = 'text',
  placeholder,
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

  // The floating label technique relies on the :placeholder-shown CSS selector.
  // We must ensure the input always has a placeholder value, even if it's just a space.
  const resolvedPlaceholder = placeholder || " "

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
      <div className={`m3-text-field__container ${multiline ? 'm3-text-field__container--multiline' : ''}`}>
        {multiline ? (
          <textarea
            {...(props as any)}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError ? 'true' : undefined}
            className={['m3-text-field__input', 'm3-text-field__input--multiline', className ?? ''].filter(Boolean).join(' ')}
            disabled={disabled}
            id={inputId}
            placeholder={resolvedPlaceholder}
            rows={rows}
          />
        ) : (
          <input
            {...(props as any)}
            aria-describedby={describedBy || undefined}
            aria-invalid={hasError ? 'true' : undefined}
            className={['m3-text-field__input', className ?? ''].filter(Boolean).join(' ')}
            disabled={disabled}
            id={inputId}
            placeholder={resolvedPlaceholder}
            type={type}
          />
        )}
        <label className="m3-text-field__label" htmlFor={inputId}>
          {label}
        </label>
      </div>
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
