import { useMemo, useState } from 'react'
import { Button } from "../Button";

import './Carousel.css'

type CarouselProps = {
  items: readonly string[]
  activeIndex?: number
  defaultActiveIndex?: number
  onActiveIndexChange?: (index: number) => void
  ariaLabel?: string
}

const clampIndex = (index: number, length: number) => {
  if (length === 0) {
    return 0
  }

  if (index < 0) {
    return 0
  }

  if (index >= length) {
    return length - 1
  }

  return index
}

export function Carousel({
  items,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveIndexChange,
  ariaLabel = 'Carousel',
}: CarouselProps) {
  const safeItems = useMemo(() => items.filter(Boolean), [items])
  const isControlled = activeIndex !== undefined
  const [internalIndex, setInternalIndex] = useState(() =>
    clampIndex(defaultActiveIndex, safeItems.length),
  )

  if (safeItems.length === 0) {
    return null
  }

  const index = clampIndex(isControlled ? activeIndex : internalIndex, safeItems.length)

  const setIndex = (nextIndex: number) => {
    const clamped = clampIndex(nextIndex, safeItems.length)
    if (!isControlled) {
      setInternalIndex(clamped)
    }
    onActiveIndexChange?.(clamped)
  }

  return (
    <section aria-label={ariaLabel} className="m3-carousel" role="region">
      <p className="m3-carousel__item">{safeItems[index]}</p>
      <div className="m3-carousel__actions">
        <Button onClick={() => setIndex(index - 1)} variant="outlined">
          Zurück
        </Button>
        <Button onClick={() => setIndex(index + 1)} variant="outlined">
          Weiter
        </Button>
      </div>
    </section>
  )
}
