# Animation improvement plans — react-md3

Produced by an `improve-animations` audit at commit `5c6d25f` (2026-07-11). Each plan is
self-contained: exact file:line references, current code verbatim, exact target values,
and a feel-check protocol. Execute with any agent
(`improve-animations execute <plan>`), one plan per branch/PR recommended.

## Plans

| # | Plan | Severity | Category | Status |
| --- | --- | --- | --- | --- |
| 001 | [Complete M3 motion tokens, migrate hand-typed values](001-motion-tokens.md) | HIGH | Cohesion & tokens | DONE — merged as `2130a50` |
| 002 | [Sheet & date-picker exit animations (interruptible)](002-sheet-picker-exit-animations.md) | HIGH | Exit motion / interruptibility | DONE — merged as `7a7acc2`; feel-check pending |
| 003 | [Dialog / FullScreenDialog / Snackbar → transitions](003-dialog-snackbar-transitions.md) | MEDIUM | Interruptibility / easing | DONE — merged as `eb849fd`; feel-check pending |
| 004 | [Tooltip enter motion (@starting-style)](004-tooltip-enter-motion.md) | MEDIUM | Easing / missed motion | DONE — merged as `bfc01f7`; feel-check pending |
| 005 | [Gate hover styles for touch](005-touch-hover-gating.md) | MEDIUM | Accessibility | DONE — merged as `69f84dd`; feel-check pending |
| 006 | [ButtonGroup check: scale(0) keyframes → transitions](006-buttongroup-check-transition.md) | MEDIUM | Physicality | EXECUTED 2026-07-12 — review passed; applied to main working tree (uncommitted); feel-check pending |
| 007 | [FAB menu: stagger on open only, snap close](007-fab-menu-close-stagger.md) | MEDIUM | Asymmetric timing | TODO |
| 008 | [Reduced-motion sweep + library-wide verification](008-reduced-motion-sweep.md) | HIGH | Accessibility | TODO |

## Execution order & dependencies

```
001 (tokens)          ── first; defines the easing/duration tokens every other plan cites
 ├─ 002 (sheets)      ── uses emphasized-accelerate/-decelerate + remapped durations
 ├─ 003 (dialogs)     ── same tokens; independent of 002 (different files)
 ├─ 004 (tooltips)    ── same tokens
 ├─ 006 (buttongroup) ── uses short2/standard (also fine pre-001)
 └─ 007 (fab menu)    ── uses accelerate/decelerate tokens
005 (hover gating)    ── independent, any time
008 (reduced motion)  ── LAST: fills remaining gaps and verifies the whole library,
                         assuming the per-component RM blocks from 002/003/004/007 landed
```

Recommended sequence: **001 → 002 → 003 → 004 → 005 → 006 → 007 → 008**.

File-ownership notes (to avoid conflicts if executed out of order):

- 001 deliberately skips animation blocks owned by 002/003/006/007; those plans list
  what they own in their Boundaries sections.
- 002 and 003 use the same TSX pattern (`rendered`/`entered` + transitionend + timeout
  fallback) but touch disjoint files.
- 003's executor MUST read plan 002's "Execution notes" first: the shared TSX pattern
  needed two review amendments (focus effect gated on `rendered`; rAF chain nested in
  the mount timer, all handles cancelled), and Dialog.tsx / FullScreenDialog.tsx carry
  the same latent focus-on-controlled-open bug that 002's review caught in the sheets.
- 008 must not patch files owned by 002/003/004/007 — it reports gaps instead.

## Audit context (for reviewers)

- Stack: React 19 MD3 component library, pure CSS motion, tokens in `react-md3/src/index.css`.
- In-repo motion exemplar: `Checkbox.css:84-90` (token-based, interruptible, scale-from-0.5).
- Vetted non-findings (do not "fix"): Ripple `scale(0)` (grows from touch point by
  design), Radio dot `scale(0)` via transition (M3 convention), no scale-press on
  buttons (the ripple *is* M3's press feedback), `linear` easing on indeterminate
  progress, 75→100ms snackbar exit retiming (token alignment).
- Known adjacent issue, deliberately out of scope: FAB menu items stay keyboard-
  focusable while visually hidden (`Fab.css` `opacity: 0` menu) — flagged in plan 007's
  boundaries for the maintainer.
- Missed opportunities noted for the backlog (not planned): a real modal
  NavigationDrawer component (the demo hand-rolls one in `App.css`), drag-to-dismiss
  for the BottomSheet's decorative drag handle, and reusing SplitButton's
  scale-from-origin pattern when Menu gains anchored positioning.
