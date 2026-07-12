# 003 — Convert Dialog, FullScreenDialog, and Snackbar from keyframes to interruptible transitions

- **Status**: EXECUTED 2026-07-12 — review-approved, uncommitted in worktree `agent-a1ae219c620e8a737` (base `7a7acc2`); pending merge + browser feel-check (see Execution notes)
- **Commit**: 5c6d25f
- **Severity**: MEDIUM
- **Category**: Interruptibility / easing
- **Depends on**: plan 001 (easing tokens)
- **Estimated scope**: 3 CSS + 3 TSX files; existing tests stay green

## Problem

All three overlays animate with `@keyframes`. Keyframes restart from zero: if a dialog
is closed during its enter (Esc is bound and works mid-enter), the exit keyframe starts
from the fully-open pose — visible jump. Snackbar is the worst case because it is
rapid-fire (auto-hide, message replacement, Esc).

They also use weak built-in curves and MD2-era hand-typed curves instead of the
library's tokens:

```css
/* react-md3/src/components/Dialog/Dialog.css:12,16,33,37 — current */
  animation: m3-dialog-scrim-enter 150ms ease-out;
  animation: m3-dialog-scrim-exit 75ms ease-in forwards;
  animation: m3-dialog-enter 150ms ease-out;
  animation: m3-dialog-exit 75ms ease-in forwards;
```

```css
/* react-md3/src/components/Snackbar/Snackbar.css:27,31 — current */
  animation: m3-snackbar-enter 150ms cubic-bezier(0, 0, 0.2, 1);      /* MD2 legacy decelerate */
  animation: m3-snackbar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards; /* MD2 legacy accelerate */
```

```css
/* react-md3/src/components/Dialog/FullScreenDialog.css:10,14 — current */
  animation: m3-fullscreen-dialog-enter 250ms ease-out;
  animation: m3-fullscreen-dialog-exit 200ms ease-in forwards;
```

Finally, unmount timing is a magic number duplicated in JS — `Dialog.tsx:87` and
`Snackbar.tsx` defer unmount with `setTimeout(..., 75)`, `FullScreenDialog.tsx:79` with
`setTimeout(..., 200)` — which silently desyncs if anyone edits the CSS.

## Target

Same mechanism as plan 002 (rendered/entered flags, enter armed by double-rAF, unmount
on `transitionend` with a timeout fallback). Asymmetric timing, M3 curves:

| Component | Enter | Exit |
| --- | --- | --- |
| Dialog (+ scrim) | 150ms `emphasized-decelerate` (scrim: `standard`) | 100ms `emphasized-accelerate` (scrim: `standard`) |
| Snackbar | 150ms `emphasized-decelerate` | 100ms `emphasized-accelerate` |
| FullScreenDialog | 250ms `emphasized-decelerate` | 200ms `emphasized-accelerate` |

Exits move from 75ms to 100ms so they hit the `--md-sys-motion-duration-short2` token —
imperceptible difference, and the existing tests (which flush 100ms) keep passing.

### Dialog.css

Delete all four keyframes (lines 103-133) and the four `animation:` lines plus the
`--closing` rules. Add:

```css
.m3-dialog-scrim {
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-dialog-scrim--open {
  opacity: 1;
  transition-duration: var(--md-sys-motion-duration-short3);
}

.m3-dialog {
  opacity: 0;
  transform: scale(0.9);
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized-accelerate),
              transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-dialog--open {
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  .m3-dialog, .m3-dialog--open { transform: none; transition-property: opacity; }
}
```

(These property blocks merge into the existing `.m3-dialog-scrim` / `.m3-dialog` rules —
keep all current layout/color declarations.)

### FullScreenDialog.css

Delete the two keyframes (lines 107-123), the `animation:` lines (10, 14) and the
`--closing` rule (13-15). Add to the existing rules:

```css
.m3-fullscreen-dialog {
  transform: translateY(100%);
  transition: transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-fullscreen-dialog--open {
  transform: translateY(0);
  transition: transform var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-emphasized-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  .m3-fullscreen-dialog {
    transform: none;
    opacity: 0;
    transition-property: opacity;
  }
  .m3-fullscreen-dialog--open { transform: none; opacity: 1; }
}
```

### Snackbar.css

Delete both keyframes (lines 85-105), the `animation:` line (27) and the `--closing`
rule (30-32). Add to `.m3-snackbar` (keeping all current declarations):

```css
.m3-snackbar {
  opacity: 0;
  transform: translateY(100%);
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized-accelerate),
              transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-emphasized-accelerate);
}

.m3-snackbar--open {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate);
}

@media (prefers-reduced-motion: reduce) {
  .m3-snackbar, .m3-snackbar--open { transform: none; transition-property: opacity; }
}
```

### TSX (all three)

Each component already has `rendered` state and a mount/unmount effect
(`Dialog.tsx:70-90`, `Snackbar.tsx:48` + effect, `FullScreenDialog.tsx:63-82`). Replace
that effect and the `closing` wiring:

```tsx
  const [rendered, setRendered] = useState(isOpen)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setRendered(true)
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true))
      })
      return () => cancelAnimationFrame(raf)
    }

    setEntered(false)
    const timer = window.setTimeout(() => setRendered(false), EXIT_MS)
    return () => window.clearTimeout(timer)
  }, [isOpen])

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>) => {
    if (!isOpen && event.target === panelRef.current) {
      setRendered(false)
    }
  }
```

- `EXIT_MS`: **100** for Dialog and Snackbar, **200** for FullScreenDialog (inline the
  number; add a comment `/* keep in sync with exit duration in <file>.css */`).
- Dialog: remove `const closing = rendered && !isOpen` (line 163); scrim class becomes
  `entered ? 'm3-dialog-scrim--open' : ''` (line 171), panel class
  `entered ? 'm3-dialog--open' : ''` (line 182); attach `onTransitionEnd` to the panel
  div (`ref={panelRef}` exists).
- Snackbar: same replacement for its `closing` class (lines 110, 120-124); the snackbar
  `<div role="status">` needs a ref (`const panelRef = useRef<HTMLDivElement>(null)`) +
  `onTransitionEnd`. Keep the auto-hide effect exactly as is.
- FullScreenDialog: same (its `--closing` wiring at lines 153-163); the dialog surface
  div gets the ref + `onTransitionEnd` if it doesn't already have a ref.
- `TransitionEvent` comes from `import type { TransitionEvent } from 'react'`.

Tests: `Dialog.test.tsx` and `Snackbar.test.tsx` already run fake timers and flush
100ms after closing — they must pass **unchanged** (the 100ms fallback fires within the
flush). FullScreenDialog tests flushed 200ms for the old timer; unchanged. If any test
fails on timing, STOP and report rather than editing assertions — a failure means the
fallback numbers above weren't applied exactly.

## Repo conventions to follow

- Tokens only (post-plan-001): never hand-type a cubic-bezier here.
- The `rendered` deferred-unmount pattern is this repo's own (`Dialog.tsx:70-90`); this
  plan upgrades it in place rather than introducing a new abstraction or shared hook.
- Modals scale from center — correct; do not add `transform-origin`.

## Boundaries

- Do NOT touch Sheets or DatePickerModal (plan 002).
- Do NOT alter focus management, `aria-*`, roles, or the auto-hide/message-replacement
  logic in Snackbar.
- Do NOT extract a shared hook/utility — three inline copies, matching how this repo
  already duplicates focus-trap logic per overlay.
- Do NOT add dependencies.
- If cited lines have drifted from 5c6d25f, STOP and report.

## Verification

- **Mechanical**: `cd react-md3 && npm run lint && npm run test && npm run build` —
  all pass **without editing Dialog/Snackbar test assertions**.
- **Feel check** (`npm run dev`):
  - Open a dialog and hit Esc mid-enter: it reverses from its current scale — no jump
    to full size, no restart.
  - Snackbar: trigger show, hit Esc immediately, trigger show again, repeatedly —
    motion always continues from the current position; nothing snaps to offscreen.
  - FullScreenDialog: enters decisively but settles gently (decelerate); exits faster
    than it entered.
  - DevTools Animations panel at 10%: dialog scrim and panel start together; exit is
    visibly snappier than enter.
  - Emulate `prefers-reduced-motion: reduce`: all three fade only (no scale, no slide);
    feedback is still visible.
- **Done when**: zero `@keyframes` remain in the three CSS files, spamming open/close
  never restarts motion from zero, and the full test suite is green untouched.

## Execution notes (2026-07-12, worktree `agent-a1ae219c620e8a737`, base `7a7acc2`)

Executed with plan 002's three amendments pre-applied (lint-safe setState via
`setTimeout(fn, 0)`; rAF chain nested inside the mount timer with all three handles
cancelled on cleanup; focus effects gated on `rendered` with `rendered` in deps). No
further amendments were needed. The latent focus-on-controlled-open bug in `Dialog.tsx`
and `FullScreenDialog.tsx` flagged by 002's review is fixed; regression tests
("focuses the modal when controlled open flips to true") added to both test files.
Diff to test files verified additive-only — zero existing assertions changed.

Review verdict: **APPROVED**. `npm run lint` / `test` / `build` all green
(39 test files, 155 tests). Zero `@keyframes`, `animation:`, `--closing`, or
hand-typed curves remain in the three CSS files; repo-wide grep found no dangling
references to the removed keyframe/class names.

Browser feel-check still pending (needs a human): Esc mid-enter reverses from current
pose (no jump/restart), rapid-fire snackbar never snaps offscreen, FullScreenDialog
exit (200ms accelerate) reads snappier than enter (250ms decelerate), scrim and panel
start together, reduced-motion shows fades only.
