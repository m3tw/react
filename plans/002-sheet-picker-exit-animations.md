# 002 — Give sheets and the date-picker modal real exit animations (interruptible transitions)

- **Status**: TODO
- **Commit**: 5c6d25f
- **Severity**: HIGH
- **Category**: Exit motion / interruptibility
- **Depends on**: plan 001 (uses `--md-sys-motion-easing-emphasized-decelerate` / `-accelerate` and spec-valued duration tokens)
- **Estimated scope**: 3 CSS + 3 TSX + 3 test files

## Problem

BottomSheet and SideSheet animate **in** over 250ms, then vanish **instantly** on close
— the component unmounts on the same render:

```tsx
// react-md3/src/components/Sheet/BottomSheet.tsx:128-130 — current
  if (!isOpen) {
    return null
  }
```

```css
/* react-md3/src/components/Sheet/BottomSheet.css:11-18, 42 — current */
@keyframes m3-bottom-sheet-slide-in {
  from { transform: translateY(100%); }
  to   { transform: translateY(0); }
}
.m3-bottom-sheet {
  /* … */
  animation: m3-bottom-sheet-slide-in var(--md-sys-motion-duration-medium2) var(--md-sys-motion-easing-emphasized);
}
```

`SideSheet.tsx:141-143` and `DatePickerModal.tsx:63` (`if (!open) return null`) have the
same defect. Dialog and Snackbar already animate out (they use a deferred-unmount
`--closing` pattern), so the library is inconsistent with itself: some overlays leave
gracefully, the largest surfaces teleport.

Two additional defects fixed by the same rewrite:

1. **Keyframe enter is non-interruptible** — closing a sheet mid-enter can't reverse
   from the current position; transitions retarget, keyframes can't.
2. **The standard BottomSheet jumps horizontally after entering.** Its resting rule is
   `transform: translateX(-50%)` (`BottomSheet.css:49`), but the enter keyframe animates
   `transform` to `translateY(0)` — during the animation the centering translateX is
   overridden, and it snaps back when the animation ends.

```css
/* react-md3/src/components/Sheet/BottomSheet.css:45-52 — current */
.m3-bottom-sheet--standard {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  /* … */
}
```

## Target

Class-driven **transitions** (never keyframes) with asymmetric timing — enter 250ms
decelerate, exit 200ms accelerate (150ms for the small picker modal). The element stays
mounted until the exit transition ends. Interrupting mid-motion (Esc during enter)
retargets smoothly from the current position.

### BottomSheet.css

Delete both keyframes (`m3-bottom-sheet-slide-in`, `m3-bottom-sheet-scrim-fade-in`) and
the two `animation:` declarations (lines 29-31 and 42 region). Add:

```css
.m3-bottom-sheet-scrim {
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-bottom-sheet-scrim--open {
  opacity: 1;
  transition-duration: var(--md-sys-motion-duration-medium1);
}

.m3-bottom-sheet {
  transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-bottom-sheet--open {
  transition: transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate);
}

.m3-bottom-sheet--modal { transform: translateY(100%); }
.m3-bottom-sheet--modal.m3-bottom-sheet--open { transform: translateY(0); }

/* standard variant: keep the horizontal centering inside every state (fixes the jump) */
.m3-bottom-sheet--standard { transform: translateX(-50%) translateY(100%); }
.m3-bottom-sheet--standard.m3-bottom-sheet--open { transform: translateX(-50%) translateY(0); }

@media (prefers-reduced-motion: reduce) {
  .m3-bottom-sheet { transition-property: opacity; opacity: 0; }
  .m3-bottom-sheet--open { opacity: 1; }
  .m3-bottom-sheet--modal { transform: none; }
  .m3-bottom-sheet--modal.m3-bottom-sheet--open { transform: none; }
  .m3-bottom-sheet--standard { transform: translateX(-50%); }
  .m3-bottom-sheet--standard.m3-bottom-sheet--open { transform: translateX(-50%); }
}
```

Note: `.m3-bottom-sheet--standard` currently sets `transform: translateX(-50%)` inside
its main rule at `BottomSheet.css:49` — remove that line (the state rules above own the
transform now).

### SideSheet.css

Delete both keyframes and both `animation:` declarations (lines 10-30 region and 57).
Only the modal variant animates (the standard variant is an inline panel and currently
has no enter animation — keep that). Add:

```css
.m3-side-sheet-scrim {
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-standard);
}

.m3-side-sheet-scrim--open {
  opacity: 1;
  transition-duration: var(--md-sys-motion-duration-medium1);
}

.m3-side-sheet--modal {
  transform: translateX(100%);
  transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-side-sheet--modal.m3-side-sheet--open {
  transform: translateX(0);
  transition: transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  .m3-side-sheet--modal { transform: none; opacity: 0; transition-property: opacity; }
  .m3-side-sheet--modal.m3-side-sheet--open { transform: none; opacity: 1; }
}
```

### DatePickerModal.css

Delete the `m3-modal-enter` keyframes (lines 33-42) and the `animation:` line (29). Add
`opacity: 0` + transition to the scrim, and scale+fade states to the panel:

```css
.m3-datepicker-modal__scrim {
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
}

.m3-datepicker-modal__scrim--open {
  opacity: 1;
  transition-duration: var(--md-sys-motion-duration-medium1);
}

.m3-datepicker-modal {
  opacity: 0;
  transform: scale(0.85);
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-accelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-datepicker-modal--open {
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  .m3-datepicker-modal { transform: none; transition-property: opacity; }
  .m3-datepicker-modal--open { transform: none; }
}
```

(Modals scale from center — that is correct; do not add a transform-origin.)

### TSX pattern (all three components)

Two state flags: `rendered` (element in the DOM) and `entered` (open styles applied).
Enter: mount closed, then flip `entered` after two animation frames so the browser
commits the closed styles first. Exit: drop `entered`, unmount on `transitionend` with a
timeout fallback (jsdom fires no transition events; the fallback also covers
`display:none` ancestors).

For **BottomSheet.tsx** — replace lines 128-130 and the `isOpen` wiring:

```tsx
  const [rendered, setRendered] = useState(isOpen)
  const [entered, setEntered] = useState(false)

  // Deferred unmount so the exit transition can play; double-rAF arms the enter.
  useEffect(() => {
    if (isOpen) {
      setRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true))
      })
      return () => cancelAnimationFrame(raf)
    }

    setEntered(false)
    const timer = window.setTimeout(() => setRendered(false), 250)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!isOpen && event.target === panelRef.current) {
      setRendered(false)
    }
  }
```

- Add `TransitionEvent` to the existing `import type { KeyboardEvent, ReactNode } from 'react'`.
- Replace `if (!isOpen) return null` with `if (!rendered) return null`.
- Panel className gains `entered ? 'm3-bottom-sheet--open' : ''`; scrim className gains
  `entered ? 'm3-bottom-sheet-scrim--open' : ''`.
- Add `onTransitionEnd={handleTransitionEnd}` to the panel `<div>` (the one with
  `ref={panelRef}`).
- The two focus-management effects keep watching `isOpen` — unchanged.

**SideSheet.tsx**: identical changes (its panel also has `ref={panelRef}`; scrim class
`m3-side-sheet-scrim--open`). The standard variant has no transitions, so its exit
falls through to the 250ms fallback timer; that is acceptable (invisible, brief), or
short-circuit with `if (!isModal) { setEntered(false); setRendered(false); return }` in
the close branch — prefer the short-circuit.

**DatePickerModal.tsx**: the component takes an `open` prop (no internal open state).
Insert the same `rendered`/`entered` pair after the existing `useState` calls (lines
58-61), replace `if (!open) return null` (line 63) with `if (!rendered) return null`
**after** the new `useEffect` (hooks must not sit below an early return), fallback
timer 150ms, and attach `onTransitionEnd` to the `.m3-datepicker-modal` div with a ref:

```tsx
  const panelRef = useRef<HTMLDivElement>(null)
```

Class wiring: `.m3-datepicker-modal--open` and `.m3-datepicker-modal__scrim--open` when
`entered`.

### Tests

`BottomSheet.test.tsx` and `SideSheet.test.tsx` assert removal immediately after a close
interaction; the deferred unmount needs a timer flush. Mirror the fake-timer convention
from `react-md3/src/components/Dialog/Dialog.test.tsx:7-14`:

```tsx
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    cleanup()
    vi.useRealTimers()
  })
```

Then, in every test that closes a sheet/modal and asserts
`…not.toBeInTheDocument()` (find them with
`grep -n "not.toBeInTheDocument" react-md3/src/components/Sheet/*.test.tsx react-md3/src/components/DateTimePicker/*.test.tsx`),
insert before the assertion:

```tsx
    act(() => { vi.advanceTimersByTime(250) })
```

Known locations at commit 5c6d25f: `BottomSheet.test.tsx:62`, `:117` (plus the
scrim-click test between them); `SideSheet.test.tsx:47`, `:62`, `:147` (the modal ones;
standard-variant closes are instant if you implemented the short-circuit). Add `act` and
`vi` imports where missing. Assertions that only verify content while open need no
change (`entered` gates CSS classes, not rendering).

## Repo conventions to follow

- Deferred-unmount state machine precedent: `react-md3/src/components/Dialog/Dialog.tsx:70-90`
  (this plan's pattern is the transition-based evolution of it).
- Tokens from `react-md3/src/index.css` (post-plan-001); never hand-type a curve.
- Class naming: BEM-ish modifiers (`m3-bottom-sheet--modal`) — the new `--open` modifier
  follows it.

## Boundaries

- Do NOT touch Dialog, FullScreenDialog, or Snackbar (plan 003).
- Do NOT touch `DateTimePicker.tsx`'s inline dropdown container or `TimePicker` (their
  enter-only anchored pattern is out of scope here).
- Do NOT add drag-to-dismiss or any pointer handling to the drag handle.
- Do NOT change focus-trap/focus-restore logic beyond what's specified.
- Do NOT add dependencies.
- If the cited code has drifted from 5c6d25f, STOP and report.

## Verification

- **Mechanical**: `cd react-md3 && npm run lint && npm run test && npm run build` — all green.
- **Feel check** (`npm run dev`):
  - Open the modal bottom sheet, press Esc *while it is still sliding in* — it must
    reverse from its current position without jumping to full height first.
  - Close a fully-open sheet: it slides out in ~200ms while the scrim fades; nothing
    teleports.
  - Standard bottom sheet: during enter it stays horizontally centered the whole time
    (the pre-existing sideways jump is gone).
  - Date picker: open/close — scale+fade both ways; Esc mid-enter reverses smoothly.
  - DevTools → Rendering → Animations at 10% speed: exit is visibly faster than enter.
  - DevTools → Rendering → `prefers-reduced-motion: reduce`: sheets and picker fade
    only — zero translation/scale — but still fade.
- **Done when**: all overlays in this plan animate out, mid-animation interruptions
  retarget (no restarts), tests pass, and reduced-motion shows fades only.
