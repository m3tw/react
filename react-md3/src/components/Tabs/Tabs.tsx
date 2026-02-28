import { useMemo, useState } from 'react'
import { Ripple } from "../Ripple";

import './Tabs.css'

type TabItem = {
  label: string
  value: string
  disabled?: boolean
  hidden?: boolean
}

type TabsProps = {
  tabs: readonly TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
}

const getFirstSelectableValue = (tabs: readonly TabItem[]) => tabs.find((tab) => !tab.disabled)?.value

const isSelectableValue = (tabs: readonly TabItem[], selectedValue: string | undefined) =>
  tabs.some((tab) => tab.value === selectedValue && !tab.disabled)

export function Tabs({
  tabs,
  value,
  defaultValue,
  onValueChange,
  ariaLabel = 'Tabs',
}: TabsProps) {
  const visibleTabs = useMemo(() => tabs.filter((tab) => !tab.hidden), [tabs])
  const firstSelectableValue = useMemo(() => getFirstSelectableValue(visibleTabs), [visibleTabs])
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    isSelectableValue(visibleTabs, defaultValue) ? defaultValue : firstSelectableValue,
  )
  const activeValue = isControlled ? value : internalValue

  const selectTab = (tab: TabItem) => {
    if (tab.disabled) {
      return
    }

    if (!isControlled) {
      setInternalValue(tab.value)
    }

    onValueChange?.(tab.value)
  }

  return (
    <div aria-label={ariaLabel} className="m3-tabs" role="tablist">
      {visibleTabs.map((tab) => {
        const isActive = tab.value === activeValue
        return (
          <button
            aria-selected={isActive ? 'true' : 'false'}
            className={['m3-tabs__tab', isActive ? 'm3-tabs__tab--active' : ''].filter(Boolean).join(' ')}
            disabled={tab.disabled}
            key={tab.value}
            onClick={() => selectTab(tab)}
            role="tab"
            type="button"
          >
            <Ripple />
            <span className="m3-tabs__label">{tab.label}</span>
            {isActive ? <div className="m3-tabs__indicator" /> : null}
          </button>
        )
      })}
    </div>
  )
}
