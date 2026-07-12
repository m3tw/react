# 007 — FAB menu: stagger on open only, snap on close

- **Status**: EXECUTED 2026-07-12 — review passed; applied to main working tree (uncommitted); feel-check pending
- **Commit**: 5c6d25f
- **Severity**: MEDIUM
- **Category**: Asymmetric timing / cohesion
- **Depends on**: plan 001 (accelerate/decelerate easing tokens)
- **Estimated scope**: 1 CSS file (Fab.css), no TSX changes

## Problem

The FAB speed-dial menu staggers its items with a per-item `transition-delay` on the
**base** rule, so the delay applies in *both* directions:

```css
/* react-md3/src/components/Fab/Fab.css:153-185 — current */
.m3-fab__menu {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 150ms ease;
}

.m3-fab__menu--open {
  pointer-events: auto;
  opacity: 1;
}

/* Menu item row: label + small fab */
.m3-fab__menu-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(16px) scale(0.8);
  transition: opacity 200ms ease, transform 200ms cubic-bezier(0.2, 0, 0, 1);
  transition-delay: calc(var(--fab-item-index, 0) * 50ms);
}

.m3-fab__menu--open .m3-fab__menu-item-row {
  opacity: 1;
  transform: translateY(0) scale(1);
}
```

Opening staggers nicely (`--fab-item-index` is set per row in `Fab.tsx:69`, counting
top-down so the row nearest the FAB leads). But on **close**, each row *waits its
stagger delay before starting to leave* — with 5 items the farthest row lingers
~450ms (4×50ms + 200ms). Dismissals must snap: deliberate actions can be slow,
the system's response to "get out of my way" cannot.

Untokenized values (`150ms ease`, `200ms ease`, hand-typed standard curve) ride along.

## Target

Replace the three rules above (keeping all layout declarations) with:

```css
.m3-fab__menu {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 12px;
  pointer-events: none;
  opacity: 0;
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard);
}

.m3-fab__menu--open {
  pointer-events: auto;
  opacity: 1;
}

/* Menu item row: closed state doubles as the exit — fast, no stagger */
.m3-fab__menu-item-row {
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  transform: translateY(16px) scale(0.8);
  transition: opacity var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard-accelerate),
              transform var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard-accelerate);
  transition-delay: 0ms;
}

/* Open state: decelerate in, stagger applies only here */
.m3-fab__menu--open .m3-fab__menu-item-row {
  opacity: 1;
  transform: translateY(0) scale(1);
  transition: opacity var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-decelerate),
              transform var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-decelerate);
  transition-delay: calc(var(--fab-item-index, 0) * 50ms);
}

@media (prefers-reduced-motion: reduce) {
  .m3-fab__menu-item-row,
  .m3-fab__menu--open .m3-fab__menu-item-row {
    transform: none;
    transition-property: opacity;
    transition-delay: 0ms;
  }
}
```

How it works: the transition that plays is the one on the element's *current target*
state. Opening → `--open` rule applies → 200ms decelerate with stagger. Closing → base
rule applies → 150ms accelerate, all rows together, zero delay. Interrupting mid-open
retargets instantly because these are transitions.

## Repo conventions to follow

- Tokens from `react-md3/src/index.css` (post-plan-001); no hand-typed curves or
  millisecond literals.
- The stagger variable `--fab-item-index` is set in
  `react-md3/src/components/Fab/Fab.tsx:69` — unchanged.
- Reduced-motion blocks live at the bottom of the component's own CSS file (pattern
  established by plans 002/003).

## Boundaries

- Do NOT touch `Fab.tsx`. (Known adjacent issue, out of scope: menu-item buttons remain
  keyboard-focusable while the menu is visually hidden — `opacity: 0` doesn't remove
  them from tab order. Note it in the PR description for the maintainer; do not fix it
  here, tests currently query menu items while closed.)
- Do NOT change `.m3-fab-group__scrim` — it is deliberately transparent (`Fab.css:10-15`).
- Do NOT touch `Fab.css:51-54` or `:94` (plan 001 owns those).
- Do NOT alter the 50ms stagger step or the `translateY(16px) scale(0.8)` closed pose.
- If the quoted block has drifted from 5c6d25f, STOP and report.

## Verification

- **Mechanical**: `cd react-md3 && npm run lint && npm run test && npm run build` — all pass.
- **Feel check** (`npm run dev`, FAB with 4-5 menu items):
  - Open: items cascade upward, ~50ms apart, nearest-first; each settles gently.
  - Close: **all items leave together, immediately** — total dismiss ≤150ms; watch the
    farthest item specifically, it must not wait its turn.
  - Open and immediately close mid-cascade: rows reverse from wherever they are.
  - DevTools Animations at 10%: open shows the delay ramp; close shows none.
  - Emulate `prefers-reduced-motion: reduce`: rows fade in place, no rise, no stagger.
- **Done when**: close is visibly instant-feeling regardless of item count and open
  still staggers.
