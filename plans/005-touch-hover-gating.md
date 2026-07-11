# 005 — Gate hover styles behind `@media (hover: hover)` (kill sticky touch-hover)

- **Status**: TODO
- **Commit**: 5c6d25f
- **Severity**: MEDIUM
- **Category**: Accessibility / input adaptation
- **Depends on**: nothing (independent)
- **Estimated scope**: 18 CSS files, 44 `:hover` rules wrapped

## Problem

Every `:hover` rule in the library fires on touch devices, where a tap applies the
hover state and **leaves it stuck** until the user taps elsewhere. The most impactful
instance is the central state layer that all interactive components share:

```css
/* react-md3/src/components/Ripple/Ripple.css:22-24 — current */
:where(button, a, [role="button"], [role="menuitem"], [role="tab"], [role="checkbox"], [role="radio"], [role="switch"], .m3-interactive):not(:disabled,[aria-disabled="true"]):hover > .m3-ripple-container > .m3-state-layer {
  opacity: var(--md-sys-state-hover);
}
```

On a phone, tapping any button leaves an 8% state layer glued to it after the ripple
ends. Every other component adds its own ungated `:hover` on top.

## Target

Every `:hover` rule wrapped in:

```css
@media (hover: hover) and (pointer: fine) {
  /* rule(s) unchanged inside */
}
```

Focus-visible, active, selected, and disabled rules stay untouched and outside the
media query. Where one CSS rule groups a `:hover` selector with a non-hover selector
(comma list), split it: the hover selector moves inside the media query, the rest stays
where it was, both keeping the identical declaration block.

## Complete inventory (all 44 rules at commit 5c6d25f)

Wrap each of these (adjacent rules in the same file may share one media-query block):

- `react-md3/src/components/Ripple/Ripple.css:22` — the shared state layer (do this one first)
- `react-md3/src/components/Card/Card.css:52, 68, 85`
- `react-md3/src/components/Dialog/FullScreenDialog.css:41, 77`
- `react-md3/src/components/SearchBar/SearchBar.css:35`
- `react-md3/src/components/DateTimePicker/DateTimePicker.css:60`
- `react-md3/src/components/DateTimePicker/Calendar.css:44, 76, 156-157 (grouped selectors — both are hover, keep grouped), 240, 257, 302`
- `react-md3/src/components/DateTimePicker/DatePickerModal.css:91, 199`
- `react-md3/src/components/Checkbox/Checkbox.css:104, 132`
- `react-md3/src/components/Switch/Switch.css:118, 151`
- `react-md3/src/components/Chip/Chip.css:118-119 (grouped, both hover)`
- `react-md3/src/components/Fab/Fab.css:62`
- `react-md3/src/components/Button/Button.css:143, 156, 165`
- `react-md3/src/components/Slider/Slider.css:96, 179` — **line 179 is a grouped
  selector list**: check whether the group includes non-hover selectors
  (`:focus-within`/`:active` variants on the following lines); if so, split as
  described in Target.
- `react-md3/src/components/Snackbar/Snackbar.css:71`
- `react-md3/src/components/TimePicker/TimePicker.css:62, 165, 247, 375, 399`
- `react-md3/src/components/RadioGroup/RadioGroup.css:118, 143`
- `react-md3/src/components/SplitButton/SplitButton.css:211, 270`
- `react-md3/src/components/TextField/TextField.css:81, 85, 121, 125`

## Repo conventions to follow

- Keep each wrapped rule inside its component's CSS file, in place (wrap where the rule
  currently sits; don't relocate rules to the bottom of the file).
- Preserve declaration blocks byte-for-byte; only the wrapping changes.
- There are currently **zero** `@media (hover: …)` queries in the codebase — this plan
  introduces the pattern; match the exact query text
  `@media (hover: hover) and (pointer: fine)` everywhere so future greps find one form.

## Boundaries

- Do NOT touch `:focus-visible`, `:active`, `--active`/`--selected` modifier, or
  disabled rules.
- Do NOT "improve" any declaration while wrapping (no value changes, no consolidation).
- Do NOT wrap the Ripple press *wave* (`.m3-ripple-wave`) — it is pointer-driven JS and
  correct on touch. Only the `:hover` state-layer rule in Ripple.css gets wrapped
  (the `:focus-visible` state-layer rule at `Ripple.css:26` stays unwrapped).
- Do NOT add dependencies or touch TSX files.
- If a listed line no longer contains a `:hover` rule (drift), STOP and report.

## Verification

- **Mechanical**:
  - `cd react-md3 && npm run lint && npm run test && npm run build` — all pass.
  - Audit that no unwrapped hover remains:
    `awk '/@media \(hover: hover\)/{d=1} d&&/{/{n++} d&&/}/{n--; if(n<0){d=0;n=0}} /:hover/&&!d{print FILENAME":"FNR": "$0}' react-md3/src/components/**/*.css react-md3/src/*.css`
    → zero output (or eyeball: `grep -rn ":hover" react-md3/src --include="*.css"` and
    confirm every hit sits inside a `@media (hover: hover)` block).
- **Feel check** (`npm run dev`):
  - DevTools device toolbar (touch emulation, e.g. Pixel): tap a Button, a Chip, a
    Card, a Calendar day — after the ripple fades, **no** state layer or background
    tint remains stuck.
  - Real mouse (no emulation): hover states all still appear exactly as before.
  - Keyboard: Tab through buttons — focus rings unaffected.
- **Done when**: the audit grep is clean, touch taps leave no residue, and mouse hover
  is unchanged.
