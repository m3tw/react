# 006 — ButtonGroup: replace scale(0) check keyframes with Checkbox-style transitions

- **Status**: DONE — merged as `e0cf2b1`; feel-check pending
- **Commit**: 5c6d25f
- **Severity**: MEDIUM
- **Category**: Physicality / interruptibility
- **Depends on**: plan 001 (tokens; this plan uses only `short2` + `standard`, which exist before 001 too)
- **Estimated scope**: 1 CSS file (ButtonGroup.css), 1 TSX file (comment-level), no test changes expected

## Problem

Segmented buttons are a rapid-toggle control, but their selection indicator uses
**keyframes from `scale(0)`**:

```css
/* react-md3/src/components/ButtonGroup/ButtonGroup.css:52-100 — current */
.m3-button-group__check,
.m3-button-group__icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  transition: transform 200ms cubic-bezier(0.2, 0, 0, 1),
              opacity 150ms ease;
}

/* Check icon scales in when appearing */
.m3-button-group__check {
  animation: segmented-check-in 250ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
}

@keyframes segmented-check-in {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.m3-button-group__check--hidden {
  visibility: hidden;
  animation: none;
}

/* Icon swap: custom icon fades in */
.m3-button-group__icon {
  animation: segmented-icon-in 200ms cubic-bezier(0.2, 0, 0, 1) forwards;
}

@keyframes segmented-icon-in {
  from {
    transform: scale(0.6);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

Defects:

1. `scale(0)` — nothing appears from nothing; the check should settle from ~0.5, like
   this library's own Checkbox already does.
2. Keyframes restart from zero on every class flip — rapid toggling makes the check
   pop repeatedly instead of reversing mid-motion.
3. Deselecting is instant (`visibility: hidden` cuts it off) — no exit at all.
4. For icon options, the TSX **swaps** the icon node
   (`react-md3/src/components/ButtonGroup/ButtonGroup.tsx:117` —
   `{isActive ? CheckIcon : option.icon}`), so React remounts the span and
   `segmented-icon-in` replays from scratch on every selection change, in both
   directions.
5. Hand-typed curves (`cubic-bezier(0.05, 0.7, 0.1, 1)` is the emphasized-decelerate
   token value; `150ms ease` is untokenized).

The repo already contains the correct pattern:

```css
/* react-md3/src/components/Checkbox/Checkbox.css:84-90 — the exemplar */
.m3-checkbox__icon {
  width: 18px;
  height: 18px;
  opacity: 0; /* Hidden by default */
  transform: scale(0.5); /* Animate scale in */
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
              transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}
```

## Target

Replace the entire block quoted above (`ButtonGroup.css:52-100`) with:

```css
.m3-button-group__check,
.m3-button-group__icon {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
}

/* Check indicator: same motion as Checkbox — interruptible transition, settles from 0.5 */
.m3-button-group__check {
  opacity: 1;
  transform: scale(1);
  transition: opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
              transform var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
}

.m3-button-group__check--hidden {
  opacity: 0;
  transform: scale(0.5);
}
```

Notes on the diff:

- Both keyframes (`segmented-check-in`, `segmented-icon-in`) are **deleted**.
- The icon span (`__icon`) gets **no animation and no transition** — the TSX remounts
  it on swap, so any CSS motion would replay artificially; an instant swap next to the
  animating check is the honest behavior. (Do not restructure the TSX to crossfade two
  stacked icons — out of scope.)
- `visibility: hidden` is dropped from `--hidden` so the fade-out can play. The span is
  `aria-hidden="true"` in the TSX and 18×18 px, always occupying layout — no reflow,
  no a11y change.
- Toggle-off now animates (fade + shrink to 0.5) — this is the interruptible reverse
  of toggle-on.

## Repo conventions to follow

- The exemplar is `react-md3/src/components/Checkbox/Checkbox.css:84-90` — copy its
  token pair (`short2` + `standard`) exactly; segmented check and checkbox check must
  feel identical.
- Class state via BEM `--hidden` modifier stays; only its declarations change.

## Boundaries

- Do NOT touch `ButtonGroup.css:39-40` (the button background/color transition — plan
  001 tokenizes it).
- Do NOT modify `ButtonGroup.tsx` logic or markup (the `{isActive ? CheckIcon :
  option.icon}` swap stays as-is).
- Do NOT add a reduced-motion block — an 18px icon settling from scale(0.5) over 100ms
  is comprehension-aiding micro-motion, kept deliberately (same policy as Checkbox).
- Do NOT add dependencies.
- If `ButtonGroup.css:52-100` doesn't match the quoted current code, STOP and report.

## Verification

- **Mechanical**: `cd react-md3 && npm run lint && npm run test && npm run build` — all
  pass (tests assert classes/aria, not animations).
- **Feel check** (`npm run dev`):
  - Click an unselected segment: the check fades in and settles from half-size —
    reads exactly like ticking the Checkbox on the same page.
  - Click it again: the check shrinks/fades out instead of vanishing.
  - Toggle one segment rapidly (5+ clicks/second): the check smoothly reverses
    mid-motion every time — it must never blink to scale(0)/empty and replay.
  - A segment configured with a custom `icon`: the icon/check swap is instant — no
    flicker of a scaling animation.
- **Done when**: `grep -n "keyframes segmented" react-md3/src/components/ButtonGroup/ButtonGroup.css`
  returns nothing, and rapid toggling shows only smooth reversals.
