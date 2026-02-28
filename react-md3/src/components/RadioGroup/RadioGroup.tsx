import { useId } from 'react'
import { Ripple } from "../Ripple";

import './RadioGroup.css'

type RadioGroupOption = {
  label: string
  value: string
  disabled?: boolean
}

type RadioGroupProps = {
  label: string
  options: readonly RadioGroupOption[]
  name?: string
  value?: string
  defaultValue?: string
  disabled?: boolean
  required?: boolean
  errorText?: string
  supportingText?: string
  onValueChange?: (value: string) => void
}

export function RadioGroup({
  label,
  options,
  name,
  value,
  defaultValue,
  disabled = false,
  required = false,
  errorText,
  supportingText,
  onValueChange,
}: RadioGroupProps) {
  const fallbackId = useId()
  const groupName = name ?? `m3-radio-group-${fallbackId}`
  const messageId = `${groupName}-message`
  const message = errorText ?? supportingText
  const hasError = Boolean(errorText)
  const isControlled = value !== undefined

  const moveSelectionWithKeyboard = (currentValue: string, direction: 1 | -1) => {
    if (disabled || options.length === 0) {
      return
    }

    const currentIndex = options.findIndex((option) => option.value === currentValue)
    if (currentIndex < 0) {
      return
    }

    for (let offset = 1; offset <= options.length; offset += 1) {
      const nextIndex = (currentIndex + direction * offset + options.length) % options.length
      const nextOption = options[nextIndex]
      if (nextOption.disabled) {
        continue
      }

      const nextInput = document.getElementById(`${groupName}-${nextIndex}`) as HTMLInputElement | null
      if (isControlled) {
        onValueChange?.(nextOption.value)
      } else {
        nextInput?.click()
      }
      nextInput?.focus()
      return
    }
  }

  return (
    <fieldset className={['m3-radio-group', hasError ? 'm3-radio-group--error' : ''].filter(Boolean).join(' ')}>
      <legend className="m3-radio-group__legend">{label}</legend>
      <div
        aria-describedby={message ? messageId : undefined}
        aria-invalid={hasError ? 'true' : undefined}
        className="m3-radio-group__options"
        role="radiogroup"
      >
        {options.map((option, index) => {
          const isOptionChecked = isControlled ? value === option.value : undefined
          const defaultOptionChecked = !isControlled ? defaultValue === option.value : undefined
          const optionDisabled = disabled || option.disabled

          return (
            <label 
              className={['m3-radio-group__option', optionDisabled ? 'm3-radio-group__option--disabled' : ''].filter(Boolean).join(' ')} 
              htmlFor={`${groupName}-${index}`} 
              key={option.value}
            >
              <div className="m3-radio__container">
                <input
                  checked={isOptionChecked}
                  defaultChecked={defaultOptionChecked}
                  disabled={optionDisabled}
                  id={`${groupName}-${index}`}
                  name={groupName}
                  onChange={(event) => {
                    if (event.target.checked) {
                      onValueChange?.(event.target.value)
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
                      event.preventDefault()
                      moveSelectionWithKeyboard(event.currentTarget.value, 1)
                    }

                    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
                      event.preventDefault()
                      moveSelectionWithKeyboard(event.currentTarget.value, -1)
                    }
                  }}
                  required={required}
                  type="radio"
                  value={option.value}
                  className="m3-radio__input"
                />
                <div className="m3-radio__visual">
                  <Ripple />
                  <div className="m3-radio__background">
                    <div className="m3-radio__mark" />
                  </div>
                </div>
              </div>
              <span className="m3-radio__label-text">{option.label}</span>
            </label>
          )
        })}
      </div>
      {message ? (
        <p
          className={['m3-radio-group__supporting-text', hasError ? 'm3-radio-group__supporting-text--error' : '']
            .filter(Boolean)
            .join(' ')}
          id={messageId}
          role={hasError ? 'alert' : undefined}
        >
          {message}
        </p>
      ) : null}
    </fieldset>
  )
}
