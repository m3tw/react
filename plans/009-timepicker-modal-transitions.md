# 009 — TimePicker modal: replace dead enter keyframe with the DatePickerModal transition pattern

- **Status**: EXECUTED 2026-07-12 — review passed; applied to main working tree (uncommitted); feel-check pending (see Verification; extra watch item: confirming from keyboard-input mode remounts content to dial mode during the 150ms exit — cosmetic, matches donor semantics)
- **Commit**: 90f49fd
- **Severity**: HIGH
- **Category**: Bug / interruptibility (regression from plan 002's keyframe cleanup)
- **Depends on**: plan 001 (motion tokens — merged `2130a50`) and plan 002 (pattern donor — merged `7a7acc2`). Both are on main; no ordering constraints remain.
- **Estimated scope**: 1 CSS file + 1 TSX file + 1 new test file

## Problem

`TimePicker.css:95` animates the time-picker modal with `m3-modal-enter` — a keyframe
that no longer exists anywhere in the source tree (plan 002 deleted it from
`DatePickerModal.css` when converting that modal to transitions, and TimePicker was
explicitly out of 002's scope). A CSS animation referencing an undefined keyframe
silently does nothing, so today the TimePicker modal:

1. **appears with zero enter motion** (the dead reference),
2. **has a scrim that pops in/out with no fade** (`TimePicker.css:80-86`, no transition),
3. **teleports away on close** — `TimePickerModal.tsx:41` hard-unmounts:

```tsx
// react-md3/src/components/TimePicker/TimePickerModal.tsx:41 — current
  if (!open) return null
```

```css
/* react-md3/src/components/TimePicker/TimePicker.css:80-86 — current */
.m3-timepicker-modal__scrim {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.32);
  z-index: -1;
}
```

```css
/* react-md3/src/components/TimePicker/TimePicker.css:88-98 — current */
.m3-timepicker-modal {
  display: flex;
  flex-direction: column;
  width: 328px;
  border-radius: 28px;
  background: var(--md-sys-color-surface-container-high);
  box-shadow: var(--md-sys-elevation-level3);
  animation: m3-modal-enter var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);
  overflow: hidden;
  padding: 24px 24px 16px;
}
```

Its sibling `DatePickerModal` (same visual family, opened from the adjacent demo
section) got the full interruptible treatment in plan 002: scrim fade both ways,
scale+opacity enter/exit with asymmetric timing, reduced-motion override, deferred
unmount with transitionend + timeout fallback. The fix is to port that exact pattern —
NOT to resurrect the dead keyframe, which would re-create the non-interruptible,
no-exit inconsistency the plan series just eliminated.

## Target

### CSS — `react-md3/src/components/TimePicker/TimePicker.css`

Mirror `DatePickerModal.css:20-59` exactly (donor code, adapted class names only).

1. Delete the dead line `animation: m3-modal-enter var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard);`
   from the `.m3-timepicker-modal` rule (all other declarations in that rule stay).

2. Directly after the `.m3-timepicker-modal__scrim` rule (which keeps its
   `position/inset/background-color/z-index` declarations unchanged), add:

```css
.m3-timepicker-modal__scrim {
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
}

.m3-timepicker-modal__scrim--open {
  opacity: 1;
  transition-duration: var(--md-sys-motion-duration-medium1);
}
```

3. Directly after the (now animation-free) `.m3-timepicker-modal` layout rule, add:

```css
.m3-timepicker-modal {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-accelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-timepicker-modal--open {
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate);
}
```

   (Base rule = exit state: 150ms accelerate out. `--open` = enter: 250ms decelerate
   in. Transitions retarget mid-flight, so rapid open/close reverses smoothly.)

4. At the very bottom of `TimePicker.css` (repo convention: reduced-motion blocks live
   at the bottom of each component's own CSS file), add:

```css
@media (prefers-reduced-motion: reduce) {
  .m3-timepicker-modal { transform: none; transition-property: opacity; }
  .m3-timepicker-modal--open { transform: none; }
}
```

### TSX — `react-md3/src/components/TimePicker/TimePickerModal.tsx`

Port the deferred-unmount state machine from `DatePickerModal.tsx:64-100` verbatim
into the `TimePickerModal` wrapper (which already owns mount/unmount). The donor code
already embodies all three amendments from plan 002's Execution notes (setState in
effects wrapped in `window.setTimeout(fn, 0)` for the error-level
`react-hooks/set-state-in-effect` rule; the rAF chain nested *inside* the mount timer
with all three handles cancelled in cleanup; the third amendment — focus effects
gating on `rendered` — is N/A here because TimePickerModal has no focus effects).

Replace the current wrapper (lines 33-53) with:

```tsx
export function TimePickerModal({
  open,
  value,
  is24Hour = false,
  initialMode = 'dial',
  onConfirm,
  onCancel,
}: TimePickerModalProps) {
  const [rendered, setRendered] = useState(open)
  const [entered, setEntered] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Deferred unmount so the exit transition can play; double-rAF arms the enter.
  useEffect(() => {
    if (open) {
      let raf1 = 0
      let raf2 = 0
      const mountTimer = window.setTimeout(() => {
        setRendered(true)
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => setEntered(true))
        })
      }, 0)
      return () => {
        window.clearTimeout(mountTimer)
        cancelAnimationFrame(raf1)
        cancelAnimationFrame(raf2)
      }
    }

    const closeTimer = window.setTimeout(() => setEntered(false), 0)
    const timer = window.setTimeout(() => setRendered(false), 150)
    return () => {
      window.clearTimeout(closeTimer)
      window.clearTimeout(timer)
    }
  }, [open])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!open && event.target === panelRef.current) {
      setRendered(false)
    }
  }

  if (!rendered) return null

  return (
    <TimePickerModalContent
      key={`${value ?? ''}-${is24Hour ? '24h' : '12h'}-${initialMode}`}
      value={value}
      is24Hour={is24Hour}
      initialMode={initialMode}
      onConfirm={onConfirm}
      onCancel={onCancel}
      entered={entered}
      panelRef={panelRef}
      onPanelTransitionEnd={handleTransitionEnd}
    />
  )
}
```

Notes on this block:

- `useState(open)` for `rendered` is load-bearing: an initially-open modal must render
  synchronously (the existing tests-by-convention and demo rely on it; the donor does
  the same).
- The 150ms fallback timer matches the exit duration
  (`--md-sys-motion-duration-short3` = 150ms); `handleTransitionEnd` normally unmounts
  first, the timer is the jsdom/edge-case fallback. Keep both.
- The existing `key` on `TimePickerModalContent` stays exactly as is. Behavior note
  (accepted, matches DatePickerModal semantics): internal state now resets when the
  exit finishes (~150ms after close) instead of instantly on close; a reopen within
  that window keeps in-progress state.

Imports at the top of the file become:

```tsx
import { useEffect, useRef, useState } from 'react'
import type { RefObject, TransitionEvent } from 'react'
```

Extend the content component's props and signature:

```tsx
type TimePickerModalContentProps = Omit<TimePickerModalProps, 'open'> & {
  entered: boolean
  panelRef: RefObject<HTMLDivElement | null>
  onPanelTransitionEnd: (event: TransitionEvent<HTMLDivElement>) => void
}
```

and destructure `entered`, `panelRef`, `onPanelTransitionEnd` in
`TimePickerModalContent`. Then in its JSX (current lines 133-140):

- scrim div:

```tsx
      <div
        className={[
          'm3-timepicker-modal__scrim',
          entered ? 'm3-timepicker-modal__scrim--open' : '',
        ].filter(Boolean).join(' ')}
        onClick={onCancel}
        aria-hidden="true"
      />
```

- panel div — add the conditional class, the ref, and the transitionend handler;
  keep `role`, `aria-modal`, `aria-label` exactly as they are:

```tsx
      <div
        className={[
          'm3-timepicker-modal',
          entered ? 'm3-timepicker-modal--open' : '',
        ].filter(Boolean).join(' ')}
        role="dialog"
        aria-modal="true"
        aria-label={`Select time. Current time is ${ariaTimeText}`}
        ref={panelRef}
        onTransitionEnd={onPanelTransitionEnd}
      >
```

### Tests — new file `react-md3/src/components/TimePicker/TimePickerModal.test.tsx`

No TimePicker tests exist today. Add this file, following the conventions of
`react-md3/src/components/Sheet/BottomSheet.test.tsx:1-14` (fake timers in
`beforeEach`, `cleanup()` + real timers in `afterEach`, `act` around timer advances):

```tsx
import { act, cleanup, fireEvent, render } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { TimePickerModal } from './TimePickerModal'

describe('TimePickerModal', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })

  it('renders the dialog synchronously when initially open', () => {
    const { getByRole } = render(<TimePickerModal open />)
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('mounts the dialog when controlled open flips to true', () => {
    const { queryByRole, getByRole, rerender } = render(<TimePickerModal open={false} />)
    expect(queryByRole('dialog')).not.toBeInTheDocument()

    rerender(<TimePickerModal open />)
    act(() => { vi.advanceTimersByTime(50) })
    expect(getByRole('dialog')).toBeInTheDocument()
  })

  it('keeps the dialog mounted during exit, then unmounts', () => {
    const { getByRole, queryByRole, rerender } = render(<TimePickerModal open />)
    expect(getByRole('dialog')).toBeInTheDocument()

    rerender(<TimePickerModal open={false} />)
    expect(queryByRole('dialog')).toBeInTheDocument()

    act(() => { vi.advanceTimersByTime(250) })
    expect(queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('calls onCancel when the scrim is clicked', () => {
    const onCancel = vi.fn()
    render(<TimePickerModal open onCancel={onCancel} />)

    fireEvent.click(document.querySelector('.m3-timepicker-modal__scrim')!)
    expect(onCancel).toHaveBeenCalledTimes(1)
  })
})
```

## Repo conventions to follow

- Pattern donor (imitate wholesale): `DatePickerModal.css:20-59` and
  `DatePickerModal.tsx:64-100` on current main (`90f49fd`).
- Motion tokens live in `react-md3/src/index.css` (plan 001); use only
  `--md-sys-motion-duration-short3` (150ms), `--md-sys-motion-duration-medium1`
  (250ms), `--md-sys-motion-easing-standard`, `--md-sys-motion-easing-emphasized-accelerate`,
  `--md-sys-motion-easing-emphasized-decelerate`. No hand-typed curves or durations.
- Reduced-motion blocks go at the bottom of the component's own CSS file.
- Background reading before editing TSX: plan 002's "Execution notes" section in
  `plans/002-sheet-picker-exit-animations.md` (the donor code already incorporates
  those amendments — do not "simplify" the setTimeout(0) wrappers or the nested rAF
  chain away; they are lint- and correctness-load-bearing).

## Steps

1. `TimePicker.css`: remove the `animation: m3-modal-enter …` line from
   `.m3-timepicker-modal` (rule at ~line 88; all other declarations stay).
2. `TimePicker.css`: add the scrim fade rules after the existing scrim rule, and the
   panel transition rules after the panel layout rule (exact CSS in Target).
3. `TimePicker.css`: append the reduced-motion block at the end of the file.
4. `TimePickerModal.tsx`: update imports; replace the wrapper body with the state
   machine; extend `TimePickerModalContentProps`; wire `entered`/`panelRef`/
   `onPanelTransitionEnd` into the scrim and panel divs (exact code in Target).
5. Create `TimePickerModal.test.tsx` with the four tests above.
6. Run verification.

## Boundaries

- Do NOT touch `.m3-timepicker-modal__content-area` / `m3-fade-in`
  (`TimePicker.css:112-124`) — working, keep-listed by plan 008.
- Do NOT touch `TimeDial.tsx` or the dial-hand transition (`TimePicker.css:~300`) —
  keep-listed by plan 008.
- Do NOT add focus management, Escape handling, or a focus trap. TimePickerModal has
  none today; that's a known a11y gap for the maintainer, out of scope for a motion
  plan (same stance as plan 007's FAB focus note).
- Do NOT change any other markup, aria attributes, or the `key` semantics on
  `TimePickerModalContent`.
- Do NOT add dependencies.
- If the code at the cited lines doesn't match the excerpts above (drift since
  `90f49fd`), STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - `cd react-md3 && npm run lint && npm run test && npm run build` — all pass
    (expect 155 existing tests + 4 new = 159).
  - `grep -rn "m3-modal-enter" react-md3/src` → zero matches (dead reference gone).
  - `grep -c "prefers-reduced-motion" react-md3/src/components/TimePicker/TimePicker.css` → 1.
- **Feel check** (`npm run dev`, demo section with the `Select Time` field —
  `App.tsx:502` — click the clock button):
  - Open: scrim fades in and the dialog scales up from 0.85 with a ~250ms decelerate —
    visually identical character to the `Select Date` picker's modal next to it.
  - Close (Cancel or scrim click): dialog shrinks/fades out noticeably faster
    (~150ms) than it entered; it does not vanish on the same frame.
  - Rapid open/close/open: motion retargets from the current position, never restarts
    from scale(0.85), never gets stuck unmounted or visible.
  - DevTools → Rendering → emulate `prefers-reduced-motion: reduce`: open/close is a
    pure crossfade (scrim + dialog opacity), zero scaling; dial hand and mode
    crossfade still behave as before.
- **Done when**: the TimePicker modal's enter/exit is indistinguishable in character
  from DatePickerModal's, `m3-modal-enter` no longer appears in the tree, all tests
  pass, and the reduced-motion walkthrough shows fades only.
