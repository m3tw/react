# 008 — prefers-reduced-motion: cover the remaining movers and verify the whole library

- **Status**: DONE — merged as `90f49fd` (2026-07-12); feel-check pending. Coverage grep: all 14 expected files. Gap pass: 4 rotate-only icon transitions (FAB icon, calendar caret, split-button arrow, time-dial hand) judged keep-list-equivalent micro-motion, documented in README backlog; TimePicker's dead `m3-modal-enter` reference flagged as a separate pre-existing bug.
- **Commit**: 5c6d25f
- **Severity**: HIGH
- **Category**: Accessibility
- **Depends on**: plans 002, 003, 004, 007 ship reduced-motion blocks for their own components; run this plan **last** — its final step verifies the whole library
- **Estimated scope**: 4 CSS files + a library-wide verification pass

## Problem

At commit 5c6d25f the library contains **zero** `prefers-reduced-motion` handling
(`grep -rn "prefers-reduced-motion" react-md3/src` → no matches) while shipping
full-viewport slides (sheets, FullScreenDialog, the demo drawer), scale zooms
(dialogs, pickers) and smooth programmatic scrolling (Carousel). For a component
library this is a WCAG 2.3.3 exposure for every consumer.

Plans 002 (sheets/date picker), 003 (dialogs/snackbar), 004 (tooltips) and 007 (FAB
menu) add reduced-motion overrides for the components they rewrite. This plan covers
the movers no other plan touches, and then verifies coverage end-to-end.

The policy (applies to every block below): reduced motion means **fewer and gentler,
not zero** — keep opacity/color feedback, remove translation and scale.

## Targets

### 1. Carousel — programmatic smooth scroll

```css
/* react-md3/src/components/Carousel/Carousel.css:23 — current */
  scroll-behavior: smooth;
```

The next/prev controls call `container.scrollBy({ left: … })`
(`Carousel.tsx:47-55`), which glides a full viewport-width of content — a classic
vestibular trigger. Append to `Carousel.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .m3-carousel__track {
    scroll-behavior: auto;
  }
}
```

### 2. Demo app modal drawer

```css
/* react-md3/src/App.css:130-145 — current */
.mobile-drawer-container {
  /* … */
  animation: drawer-slide-in 250ms cubic-bezier(0.2, 0, 0, 1);
}

@keyframes drawer-slide-in {
  from { transform: translateX(-100%); }
  to   { transform: translateX(0); }
}
```

(After plan 001 the animation line reads
`drawer-slide-in var(--md-sys-motion-duration-medium1) var(--md-sys-motion-easing-standard)` —
either form may be present; both are fine to build on.) Append to `App.css`:

```css
@media (prefers-reduced-motion: reduce) {
  .mobile-drawer-container {
    animation-name: drawer-fade-in;
  }

  @keyframes drawer-fade-in {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
}
```

### 3. Anchored popover enters — appear instantly under reduced motion

Small trigger-anchored surfaces keep their fade-free instant appearance under reduced
motion (an instant popover is calmer than any animation):

```css
/* append to react-md3/src/components/DateTimePicker/Calendar.css
   (current enter: Calendar.css:105 `animation: m3-dropdown-enter …` with scaleY(0.8)) */
@media (prefers-reduced-motion: reduce) {
  .m3-calendar__dropdown-menu {
    animation: none;
  }
}
```

```css
/* append to react-md3/src/components/SplitButton/SplitButton.css
   (current enter: SplitButton.css:234 `animation: split-menu-in …` with scaleY(0.8)) */
@media (prefers-reduced-motion: reduce) {
  .m3-split-button__menu {
    animation: none;
  }
}
```

Check the selector for the split menu: the `animation:` line at `SplitButton.css:234`
sits in the rule for the menu list element (`position: fixed; min-width: 180px; …`).
Use that rule's actual selector.

```css
/* append to react-md3/src/components/DateTimePicker/DateTimePicker.css
   (current enter: DateTimePicker.css:100 `animation: m3-date-picker-enter …` with translateY(-8px)) */
@media (prefers-reduced-motion: reduce) {
  .m3-date-time-picker__modal-container {
    animation: none;
  }
}
```

### 4. Documented keep-list (no changes — do not "fix" these)

Micro-motion that aids comprehension stays under reduced motion, per policy:

- Switch thumb slide (12px) and grow, Checkbox/Radio mark settle, ButtonGroup check
  (post-plan-006), TextField floating label, Tabs indicator, Slider thumb/value
  indicator, Ripple state layers and waves.
- ProgressIndicator / LoadingIndicator indeterminate spinners keep spinning (progress
  indication; M3 ships them under reduced motion too).
- TimePicker's internal `m3-fade-in` content crossfade — pure opacity, already gentle.

## Repo conventions to follow

- Reduced-motion blocks live at the **bottom of each component's own CSS file** —
  the same placement plans 002/003/004/007 use. No global catch-all rule: a blanket
  `* { animation: none }` would kill the keep-list feedback above.
- Keyframes referenced inside a media query must be defined in the same file (each
  component CSS is imported independently).

## Boundaries

- Do NOT touch components owned by other plans (BottomSheet/SideSheet/DatePickerModal
  → 002; Dialog/FullScreenDialog/Snackbar → 003; tooltips → 004; FAB menu → 007). If
  those plans haven't run yet, report the gap in the final verification instead of
  patching their files here.
- Do NOT reduce the keep-list components.
- Do NOT add a `useReducedMotion` JS hook — everything here is CSS-only.
- Do NOT add dependencies.

## Verification

- **Mechanical**:
  - `cd react-md3 && npm run lint && npm run test && npm run build` — all pass.
  - `grep -rln "prefers-reduced-motion" react-md3/src` → expect (at minimum, once all
    plans have run): `Carousel.css`, `App.css`, `Calendar.css`, `SplitButton.css`,
    `DateTimePicker.css`, `BottomSheet.css`, `SideSheet.css`, `DatePickerModal.css`,
    `Dialog.css`, `FullScreenDialog.css`, `Snackbar.css`, `PlainTooltip.css`,
    `RichTooltip.css`, `Fab.css`.
- **Feel check** (`npm run dev`, DevTools → Rendering → emulate
  `prefers-reduced-motion: reduce`), walk the entire demo:
  - Nothing on screen translates more than a few pixels or zooms: sheets, dialogs,
    snackbar, drawer, pickers, tooltips, FAB menu all **fade or appear instantly**.
  - Carousel next/prev jumps instead of gliding.
  - Feedback still exists: scrims and overlays still fade, checkmarks still appear,
    spinners still spin, ripples still respond.
  - Toggle emulation off and re-walk: full motion is back everywhere.
- **Done when**: with reduced motion emulated, a full walkthrough of the demo app shows
  zero large translations/scales while every state change remains visibly indicated —
  and any component still moving is listed in the report as a gap from an unexecuted
  plan.
