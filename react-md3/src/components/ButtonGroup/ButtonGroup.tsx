import { useMemo, useState } from 'react'

import './ButtonGroup.css'

type ButtonGroupOption = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
}

type ButtonGroupVariant = 'standard' | 'segmented' | 'split'

type ButtonGroupProps = {
  options: readonly ButtonGroupOption[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  variant?: ButtonGroupVariant
  ariaLabel?: string
}

const getFirstSelectableValue = (options: readonly ButtonGroupOption[]) =>
  options.find((option) => !option.disabled)?.value

const isSelectableValue = (options: readonly ButtonGroupOption[], selectedValue: string | undefined) =>
  options.some((option) => option.value === selectedValue && !option.disabled)

export function ButtonGroup({
  options,
  value,
  defaultValue,
  onValueChange,
  variant = 'standard',
  ariaLabel = 'Button Group',
}: ButtonGroupProps) {
  const visibleOptions = useMemo(
    () => options.filter((option) => !option.hidden),
    [options],
  )
  const firstSelectableValue = useMemo(
    () => getFirstSelectableValue(visibleOptions),
    [visibleOptions],
  )
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    isSelectableValue(visibleOptions, defaultValue) ? defaultValue : firstSelectableValue,
  )
  const activeValue = isControlled ? value : internalValue

  const selectOption = (option: ButtonGroupOption) => {
    if (option.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(option.value)
    }

    onValueChange?.(option.value)
  }

  return (
    <div aria-label={ariaLabel} className={['m3-button-group', `m3-button-group--${variant}`].join(' ')} role="group">
      {visibleOptions.map((option) => {
        const isActive = activeValue === option.value

        return (
          <button
            aria-pressed={isActive ? 'true' : 'false'}
            className={['m3-button-group__button', isActive ? 'm3-button-group__button--active' : '']
              .filter(Boolean)
              .join(' ')}
            disabled={option.disabled}
            key={option.value}
            onClick={() => selectOption(option)}
            type="button"
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}
