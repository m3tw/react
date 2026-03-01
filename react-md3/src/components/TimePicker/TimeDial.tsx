import { useRef, useState } from 'react'

type TimeDialProps = {
  mode: 'hour' | 'minute'
  is24Hour: boolean
  value: number // 0-23 for hour, 0-59 for minute
  onChange: (value: number) => void
  onModeSwitch?: () => void
}

export function TimeDial({ mode, is24Hour, value, onChange, onModeSwitch }: TimeDialProps) {
  const dialRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const radiusOuter = 104 // 256/2 - padding
  const radiusInner = 68 // Inner ring for 24h formatting

  // Calculate coordinates for numbers.
  const calculatePosition = (val: number, max: number, isInner: boolean) => {
    // Top is 0 degrees, so subtract 90 deg (PI/2)
    const angle = (val / max) * 2 * Math.PI - Math.PI / 2
    const r = isInner ? radiusInner : radiusOuter
    const x = 128 + r * Math.cos(angle)
    const y = 128 + r * Math.sin(angle)
    return { x, y, angle }
  }

  const handleInteraction = (clientX: number, clientY: number, complete: boolean = false) => {
    if (!dialRef.current) return
    const rect = dialRef.current.getBoundingClientRect()
    // Relative to center 128x128
    const x = clientX - rect.left - 128
    const y = clientY - rect.top - 128
    let angle = Math.atan2(y, x) + Math.PI / 2
    if (angle < 0) angle += 2 * Math.PI

    const distance = Math.sqrt(x * x + y * y)

    if (mode === 'hour') {
      const isInner = is24Hour && distance < (radiusInner + radiusOuter) / 2
      let hour = Math.round((angle / (2 * Math.PI)) * 12)
      if (hour === 0) hour = 12
      
      if (is24Hour) {
        if (isInner) {
          if (hour === 12) hour = 0
          else hour += 12
        } else {
          if (hour === 12) hour = 0 // 0 is inner, but visually top outer is 12 sometimes or 0? 
          // Actually in 24h M3, outer is 1-12, inner is 13-00.
          if (hour === 12 && isInner) hour = 0
          else if (isInner && hour < 12) hour += 12
        }
      }
      // Simple mapped assignment
      onChange(hour === 24 ? 0 : hour)
      if (complete && onModeSwitch) {
        onModeSwitch()
      }
    } else {
      // Minutes. Map 0-59
      let minute = Math.round((angle / (2 * Math.PI)) * 60)
      if (minute === 60) minute = 0
      // If just clicking, snap to 5 mins. If dragging, allow precise.
      if (!isDragging) {
        minute = Math.round(minute / 5) * 5
        if (minute === 60) minute = 0
      }
      onChange(minute)
    }
  }

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    dialRef.current?.setPointerCapture(e.pointerId)
    handleInteraction(e.clientX, e.clientY)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (isDragging) {
      handleInteraction(e.clientX, e.clientY)
    }
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false)
      dialRef.current?.releasePointerCapture(e.pointerId)
      handleInteraction(e.clientX, e.clientY, true) // Complete interaction
    }
  }

  // Draw Numbers
  const renderNumbers = () => {
    const numbers = []
    if (mode === 'hour') {
      if (is24Hour) {
        // Outer 00, 13-23
        for (let i = 1; i <= 12; i++) {
          const val = i === 12 ? 0 : i
          const { x, y } = calculatePosition(i, 12, false)
          numbers.push({ val: val === 0 ? '00' : val, x, y, inner: false, numVal: val })
        }
        for (let i = 13; i <= 24; i++) {
          const val = i === 24 ? 12 : i
          const { x, y } = calculatePosition(i, 12, true)
          numbers.push({ val: String(val), x, y, inner: true, numVal: val })
        }
      } else {
        // 1-12
        for (let i = 1; i <= 12; i++) {
          const { x, y } = calculatePosition(i, 12, false)
          numbers.push({ val: String(i), x, y, inner: false, numVal: i })
        }
      }
    } else {
      // Minutes: 0, 5, 10...55
      for (let i = 0; i < 60; i += 5) {
        const { x, y } = calculatePosition(i, 60, false)
        numbers.push({ val: i === 0 ? '00' : String(i), x, y, inner: false, numVal: i })
      }
    }

    return numbers.map((n, idx) => {
      // Determine selection
      let selected = false;
      if (mode === 'hour') {
        if (is24Hour) {
           selected = (n.numVal === value) || (value === 0 && n.val === '00')
        } else {
           let adjustedHour = value % 12
           if (adjustedHour === 0) adjustedHour = 12
           selected = n.numVal === adjustedHour
        }
      } else {
         selected = n.numVal === value
      }

      return (
        <span
          key={`dial-num-${idx}`}
          className={['m3-timedial__number', n.inner ? 'm3-timedial__number--inner' : '', selected ? 'm3-timedial__number--selected' : ''].filter(Boolean).join(' ')}
          style={{ left: `${n.x}px`, top: `${n.y}px` }}
        >
          {n.val}
        </span>
      )
    })
  }

  // Calculate hand properties
  let currentPosVal = value
  let isInnerHand = false
  if (mode === 'hour') {
    if (is24Hour) {
       // 00 and 13-23 are inner? Wait, 00 is outer top, 12 is inner top in our mapping above. Let's trace it carefully.
       // Outer: 1,2,3,4,5,6,7,8,9,10,11, 00(top)
       // Inner: 13,14,15,16,17,18,19,20,21,22,23, 12(top)
       if (value === 0) { currentPosVal = 12; isInnerHand = false; }
       else if (value === 12) { currentPosVal = 12; isInnerHand = true; }
       else if (value > 12) { currentPosVal = value - 12; isInnerHand = true; }
       else { currentPosVal = value; isInnerHand = false; }
    } else {
       currentPosVal = value % 12
       if (currentPosVal === 0) currentPosVal = 12
    }
  }

  const maxTicks = mode === 'hour' ? 12 : 60
  const pos = calculatePosition(currentPosVal, maxTicks, isInnerHand)
  const angleDeg = pos.angle * (180 / Math.PI)
  const handRadius = isInnerHand ? radiusInner : radiusOuter

  // For minutes not evenly mod 5, they don't have a label overlapping
  const isPreciseMinute = mode === 'minute' && value % 5 !== 0

  return (
    <div className="m3-timedial-container">
      <div 
        className="m3-timedial"
        ref={dialRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
      >
        <div className="m3-timedial__center" />
        <div 
          className={['m3-timedial__hand', !isDragging ? 'm3-timedial__hand--animated' : ''].filter(Boolean).join(' ')}
          style={{ width: `${handRadius}px`, transform: `rotate(${angleDeg}deg)` }}
        >
          <div className={['m3-timedial__terminal', isInnerHand ? 'm3-timedial__terminal--inner' : ''].join(' ')}>
             {isPreciseMinute && <div className="m3-timedial__terminal-dot" />}
          </div>
        </div>
        {renderNumbers()}
      </div>
    </div>
  )
}
