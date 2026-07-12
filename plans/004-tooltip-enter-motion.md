# 004 — Tooltip enter motion (fade + settle via @starting-style)

- **Status**: DONE — merged as `bfc01f7`; feel-check pending
- **Commit**: 5c6d25f
- **Severity**: MEDIUM
- **Category**: Easing & duration / missed motion
- **Depends on**: plan 001 (easing tokens)
- **Estimated scope**: 2 CSS files, no TSX changes

## Problem

Both tooltips wait out their show delay, then **pop** in with zero transition, and pop
out the same way. They are conditionally rendered
(`PlainTooltip.tsx:98-106` — `{isOpen ? <span …/> : null}`), and the CSS has no
`transition`/`animation` at all:

```css
/* react-md3/src/components/Tooltip/PlainTooltip.css:29-33 — current (one of four placements) */
.m3-plain-tooltip--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
}
```

A tooltip is a frequently-seen element; a hard pop reads as a glitch, especially on the
larger RichTooltip surface.

## Target

A 150ms fade with a barely-perceptible settle (`scale(0.96)` plain / `scale(0.98)`
rich) growing **from the trigger side**, implemented with `@starting-style` — pure CSS,
no re-render choreography needed for enter. Exit stays instant (pointer already left;
tooltip exits should never linger; in browsers without `@starting-style` the tooltip
simply appears instantly, i.e. current behavior).

### PlainTooltip.css

Add to `.m3-plain-tooltip` (keep all existing declarations):

```css
.m3-plain-tooltip {
  /* … existing … */
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-emphasized-decelerate);
}
```

Add transform-origins so the settle grows out of the anchor:

```css
.m3-plain-tooltip--top    { transform-origin: center bottom; }
.m3-plain-tooltip--bottom { transform-origin: center top; }
.m3-plain-tooltip--left   { transform-origin: right center; }
.m3-plain-tooltip--right  { transform-origin: left center; }
```

Add the starting states (top-level block; each placement composes its existing
positioning transform — copy them exactly):

```css
@starting-style {
  .m3-plain-tooltip { opacity: 0; }
  .m3-plain-tooltip--top    { transform: translateX(-50%) translateY(-4px) scale(0.96); }
  .m3-plain-tooltip--bottom { transform: translateX(-50%) translateY(4px) scale(0.96); }
  .m3-plain-tooltip--left   { transform: translateY(-50%) translateX(-4px) scale(0.96); }
  .m3-plain-tooltip--right  { transform: translateY(-50%) translateX(4px) scale(0.96); }
}
```

Reduced motion — keep the fade, drop the settle:

```css
@media (prefers-reduced-motion: reduce) {
  .m3-plain-tooltip { transition-property: opacity; }
}
```

### RichTooltip.css

Same structure, `scale(0.98)` (larger surface, subtler settle). Read the four placement
rules in `RichTooltip.css` (`--top` is at the `bottom: 100%; left: 50%;
transform: translateX(-50%) translateY(-4px);` pattern, mirroring PlainTooltip) and
compose each placement's exact existing transform with ` scale(0.98)` inside
`@starting-style`, add the same `transition`, the same four `transform-origin` rules
(class prefix `m3-rich-tooltip--*`), and the same reduced-motion override.

## Repo conventions to follow

- Tokens from `react-md3/src/index.css` (post-plan-001).
- Per-component CSS files; append new rules at the end of the relevant section, not a
  new file.
- No JS for enter states when CSS suffices — this repo keeps Tooltip logic minimal
  (timers only, `PlainTooltip.tsx:56-77`).

## Boundaries

- Do NOT touch the tooltip TSX files — no mounted-state machinery, no exit animation
  (deliberate: exits are instant).
- Do NOT change the 500ms `SHOW_DELAY` or the RichTooltip hover-linger timers.
- Do NOT change tooltip positioning values (`±4px` offsets, `bottom: 100%`, etc.) —
  only compose `scale()` after them inside `@starting-style`.
- Do NOT add dependencies.
- If placement rules differ from the excerpts (drift since 5c6d25f), STOP and report.

## Verification

- **Mechanical**: `cd react-md3 && npm run lint && npm run test && npm run build` — all
  pass (tests query by role/text, not by opacity, so none should change).
- **Feel check** (`npm run dev`):
  - Hover a tooltip trigger: after the delay, the tooltip *fades and settles outward
    from the trigger side* (top placement grows upward from its bottom edge, etc.) in
    ~150ms. No pop.
  - Move the pointer away: it disappears instantly — this is intentional.
  - DevTools Animations panel at 10%: confirm the growth direction matches each
    placement (`position="top" | bottom | left | right`).
  - Emulate `prefers-reduced-motion: reduce`: pure fade, no scale movement.
  - Sanity-check in Firefox or any browser without `@starting-style`: tooltip appears
    instantly (no broken invisible state).
- **Done when**: all 8 placement variants (2 components × 4 positions) fade+settle from
  the correct origin, and exit remains instant.
