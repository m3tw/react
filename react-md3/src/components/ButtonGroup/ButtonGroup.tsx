import { useMemo, useState } from 'react'
import { Ripple } from "../Ripple";

import './ButtonGroup.css'

type ButtonGroupOption = {
  label: string
  value: string
  icon?: React.ReactNode
  disabled?: boolean
  hidden?: boolean
}

type ButtonGroupVariant = 'standard' | 'segmented' | 'split'

/* ── Single-select props ── */
type SingleSelectProps = {
  multiSelect?: false
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

/* ── Multi-select props ── */
type MultiSelectProps = {
  multiSelect: true
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}

type ButtonGroupProps = {
  options: readonly ButtonGroupOption[]
  variant?: ButtonGroupVariant
  ariaLabel?: string
} & (SingleSelectProps | MultiSelectProps)

const getFirstSelectableValue = (options: readonly ButtonGroupOption[]) =>
  options.find((option) => !option.disabled)?.value

const isSelectableValue = (options: readonly ButtonGroupOption[], selectedValue: string | undefined) =>
  options.some((option) => option.value === selectedValue && !option.disabled)

// Check icon for multi-select selected state
const CheckIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
)

export function ButtonGroup(props: ButtonGroupProps) {
  const {
    options,
    variant = 'standard',
    ariaLabel = 'Button Group',
  } = props

  const visibleOptions = useMemo(
    () => options.filter((option) => !option.hidden),
    [options],
  )

  const firstSelectableValue = useMemo(
    () => getFirstSelectableValue(visibleOptions),
    [visibleOptions],
  )

  const [singleInternalValue, setSingleInternalValue] = useState<string | undefined>(() => {
    if (props.multiSelect) {
      return firstSelectableValue
    }

    return isSelectableValue(visibleOptions, props.defaultValue)
      ? props.defaultValue
      : firstSelectableValue
  })

  const [multiInternalValue, setMultiInternalValue] = useState<string[]>(() => {
    if (props.multiSelect) {
      return props.defaultValue ?? []
    }
    return []
  })

  // ── Multi-select mode ──
  if (props.multiSelect) {
    const { value, onValueChange } = props
    const isControlled = value !== undefined
    const activeValues = (isControlled ? value : multiInternalValue) ?? []

    const toggleOption = (option: ButtonGroupOption) => {
      if (option.disabled) return
      const next = activeValues.includes(option.value)
        ? activeValues.filter((v) => v !== option.value)
        : [...activeValues, option.value]

      if (!isControlled) setMultiInternalValue(next)
      onValueChange?.(next)
    }

    return (
      <div aria-label={ariaLabel} className={['m3-button-group', `m3-button-group--${variant}`].join(' ')} role="group">
        {visibleOptions.map((option) => {
          const isActive = activeValues.includes(option.value)
          return (
            <button
              aria-pressed={isActive ? 'true' : 'false'}
              className={['m3-button-group__button', isActive ? 'm3-button-group__button--active' : '', option.disabled ? 'm3-button-group__button--disabled' : ''].filter(Boolean).join(' ')}
              disabled={option.disabled}
              key={option.value}
              onClick={() => toggleOption(option)}
              type="button"
            >
              <Ripple />
              {option.icon ? (
                <span className="m3-button-group__icon" aria-hidden="true">
                  {isActive ? CheckIcon : option.icon}
                </span>
              ) : (
                <span className={`m3-button-group__check ${isActive ? '' : 'm3-button-group__check--hidden'}`} aria-hidden="true">{CheckIcon}</span>
              )}
              <span className="m3-button-group__label">{option.label}</span>
            </button>
          )
        })}
      </div>
    )
  }

  // ── Single-select mode ──
  const { value, onValueChange } = props
  const isControlled = value !== undefined
  const activeValue = isControlled ? value : singleInternalValue

  const selectOption = (option: ButtonGroupOption) => {
    if (option.disabled) return
    if (!isControlled) setSingleInternalValue(option.value)
    onValueChange?.(option.value)
  }

  return (
    <div aria-label={ariaLabel} className={['m3-button-group', `m3-button-group--${variant}`].join(' ')} role="group">
      {visibleOptions.map((option) => {
        const isActive = activeValue === option.value
        return (
          <button
            aria-pressed={isActive ? 'true' : 'false'}
            className={['m3-button-group__button', isActive ? 'm3-button-group__button--active' : '', option.disabled ? 'm3-button-group__button--disabled' : ''].filter(Boolean).join(' ')}
            disabled={option.disabled}
            key={option.value}
            onClick={() => selectOption(option)}
            type="button"
          >
            <Ripple />
            {option.icon ? (
              <span className="m3-button-group__icon" aria-hidden="true">
                {isActive ? CheckIcon : option.icon}
              </span>
            ) : (
              <span className={`m3-button-group__check ${isActive ? '' : 'm3-button-group__check--hidden'}`} aria-hidden="true">{CheckIcon}</span>
            )}
            <span className="m3-button-group__label">{option.label}</span>
          </button>
        )
      })}
    </div>
  )
}
