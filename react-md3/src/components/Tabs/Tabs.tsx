import { useMemo, useState, useRef, useLayoutEffect } from 'react'
import type { ReactNode } from 'react'
import { Ripple } from "../Ripple"

import './Tabs.css'

export type TabItem = {
  label: string
  value: string
  icon?: ReactNode
  disabled?: boolean
  hidden?: boolean
}

export type TabsVariant = 'primary' | 'secondary'
export type TabsLayout = 'fixed' | 'scrollable'

export type TabsProps = {
  tabs: readonly TabItem[]
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  ariaLabel?: string
  variant?: TabsVariant
  layout?: TabsLayout
  className?: string
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
  variant = 'primary',
  layout = 'fixed',
  className,
}: TabsProps) {
  const visibleTabs = useMemo(() => tabs.filter((tab) => !tab.hidden), [tabs])
  const firstSelectableValue = useMemo(() => getFirstSelectableValue(visibleTabs), [visibleTabs])
  const isControlled = value !== undefined
  const [internalValue, setInternalValue] = useState(() =>
    isSelectableValue(visibleTabs, defaultValue) ? defaultValue : firstSelectableValue,
  )
  const activeValue = isControlled ? value : internalValue

  const tablistRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<Map<string, HTMLButtonElement>>(new Map())
  
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0, opacity: 0 })

  useLayoutEffect(() => {
    if (!activeValue || !tablistRef.current) return

    const activeTab = tabRefs.current.get(activeValue)
    if (!activeTab) return

    if (variant === 'secondary') {
      // Secondary tab is full block width
      setIndicatorStyle({
        left: activeTab.offsetLeft,
        width: activeTab.offsetWidth,
        opacity: 1
      })
    } else {
      // Primary tab bounds to the content wrapper width
      const contentWrapper = activeTab.querySelector('.m3-tabs__tab-content') as HTMLElement
      if (contentWrapper) {
        setIndicatorStyle({
          left: activeTab.offsetLeft + contentWrapper.offsetLeft,
          width: contentWrapper.offsetWidth,
          opacity: 1
        })
      }
    }
  }, [activeValue, variant, visibleTabs])

  const selectTab = (tab: TabItem) => {
    if (tab.disabled) return

    if (!isControlled) {
      setInternalValue(tab.value)
    }

    onValueChange?.(tab.value)
    
    // Auto-scroll logic for scrollable tabs could go here if requested, 
    // but native browser focus often scrolls elements into view automatically.
    const element = tabRefs.current.get(tab.value)
    if (element && layout === 'scrollable' && tablistRef.current) {
      const parent = tablistRef.current
      const offsetLeft = element.offsetLeft
      const parentWidth = parent.clientWidth
      const elementWidth = element.clientWidth
      parent.scrollTo({
        left: offsetLeft - parentWidth / 2 + elementWidth / 2,
        behavior: 'smooth'
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const selectableValues = visibleTabs.filter(t => !t.disabled).map(t => t.value)
    if (selectableValues.length === 0) return

    const currentIndex = selectableValues.indexOf(activeValue as string)
    let nextIndex = currentIndex

    switch (e.key) {
      case 'ArrowLeft':
        nextIndex = currentIndex > 0 ? currentIndex - 1 : selectableValues.length - 1
        break
      case 'ArrowRight':
        nextIndex = currentIndex < selectableValues.length - 1 ? currentIndex + 1 : 0
        break
      case 'Home':
        nextIndex = 0
        break
      case 'End':
        nextIndex = selectableValues.length - 1
        break
      default:
        return
    }

    e.preventDefault()
    
    const nextValue = selectableValues[nextIndex]
    if (nextValue) {
      const tabToSelect = visibleTabs.find(t => t.value === nextValue)
      if (tabToSelect) {
        selectTab(tabToSelect)
        // Set focus to the newly selected tab
        const el = tabRefs.current.get(tabToSelect.value)
        el?.focus()
      }
    }
  }

  const containerClasses = [
    'm3-tabs',
    `m3-tabs--${variant}`,
    `m3-tabs--${layout}`,
    className || ''
  ].filter(Boolean).join(' ')

  return (
    <div 
      aria-label={ariaLabel} 
      className={containerClasses} 
      role="tablist"
      onKeyDown={handleKeyDown}
      ref={tablistRef}
    >
      {visibleTabs.map((tab) => {
        const isActive = tab.value === activeValue
        const TabItemClass = [
          'm3-tabs__tab', 
          isActive ? 'm3-tabs__tab--active' : '',
          tab.icon ? 'm3-tabs__tab--has-icon' : ''
        ].filter(Boolean).join(' ')
        
        return (
          <button
            aria-selected={isActive ? 'true' : 'false'}
            className={TabItemClass}
            disabled={tab.disabled}
            key={tab.value}
            onClick={() => selectTab(tab)}
            role="tab"
            type="button"
            tabIndex={isActive ? 0 : -1}
            ref={(el) => {
              if (el) {
                tabRefs.current.set(tab.value, el)
              } else {
                tabRefs.current.delete(tab.value)
              }
            }}
          >
            <Ripple />
            <div className="m3-tabs__tab-content">
              {tab.icon && <span className="m3-tabs__icon">{tab.icon}</span>}
              <span className="m3-tabs__label">{tab.label}</span>
            </div>
          </button>
        )
      })}
      
      {/* Absolute floating animated indicator */}
      <div 
        className="m3-tabs__indicator" 
        style={{
          transform: `translateX(${indicatorStyle.left}px)`,
          width: `${indicatorStyle.width}px`,
          opacity: indicatorStyle.opacity
        }} 
      />
    </div>
  )
}
