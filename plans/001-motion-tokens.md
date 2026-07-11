# 001 — Complete the M3 motion token set and migrate hand-typed values

- **Status**: TODO
- **Commit**: 5c6d25f
- **Severity**: HIGH
- **Category**: Cohesion & tokens
- **Estimated scope**: 13 CSS files, ~40 single-line value swaps + one token block

## Problem

The library defines only a fragment of the Material 3 motion token set, and two of the
five defined tokens have values that diverge from the M3 spec:

```css
/* react-md3/src/index.css:23-28 — current */
  /* M3 Motion */
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-medium1: 200ms;   /* M3 spec: medium1 = 250ms */
  --md-sys-motion-duration-medium2: 250ms;   /* M3 spec: medium2 = 300ms */
```

Consequences visible in the code:

1. The accelerate/decelerate easings don't exist as tokens, so components hand-type
   them: `ButtonGroup.css:67` and `SplitButton.css:234` hand-type
   `cubic-bezier(0.05, 0.7, 0.1, 1)` — which *is* M3's `emphasized-decelerate`.
2. The standard curve `cubic-bezier(0.2, 0, 0, 1)` is hand-typed (instead of using the
   existing token) in Button, ButtonGroup, Carousel, Fab, Calendar, DatePickerModal,
   DateTimePicker, TimePicker, SplitButton, and the demo `App.css`.
3. Generic weak easings are used where tokens should be: `0.2s ease`, `150ms ease`,
   `200ms ease` throughout the pickers and Carousel; `opacity 0.1s ease-in` on the Tabs
   indicator (`Tabs.css:94`) — `ease-in` delays the visible start of the fade.
4. `Fab.css:51-54` and `TopAppBar.css:14-15` carry var() fallbacks that contradict the
   token (`var(--md-sys-motion-duration-short2, 200ms)` — the token is 100ms).
5. Anyone theming against the documented M3 token names gets shifted durations because
   `medium1`/`medium2` hold the wrong values.

## Target

**Principle: this plan is value-preserving.** Every animation keeps its current
millisecond duration and its current curve shape — values only move into tokens, and the
token *names* become spec-correct. The single deliberate feel change is `Tabs.css:94`
(`ease-in` → standard curve), because ease-in on UI is always wrong.

New token block replacing `react-md3/src/index.css:23-28`:

```css
  /* M3 Motion — easing (md.sys.motion.easing.*)
     Note: the true M3 "emphasized" curve is a two-segment path; the single-cubic
     approximation equals the standard curve, so the two tokens share a value. */
  --md-sys-motion-easing-emphasized: cubic-bezier(0.2, 0.0, 0.0, 1.0);
  --md-sys-motion-easing-emphasized-decelerate: cubic-bezier(0.05, 0.7, 0.1, 1.0);
  --md-sys-motion-easing-emphasized-accelerate: cubic-bezier(0.3, 0.0, 0.8, 0.15);
  --md-sys-motion-easing-standard: cubic-bezier(0.2, 0.0, 0, 1.0);
  --md-sys-motion-easing-standard-decelerate: cubic-bezier(0, 0, 0, 1);
  --md-sys-motion-easing-standard-accelerate: cubic-bezier(0.3, 0, 1, 1);

  /* M3 Motion — duration (md.sys.motion.duration.*) */
  --md-sys-motion-duration-short1: 50ms;
  --md-sys-motion-duration-short2: 100ms;
  --md-sys-motion-duration-short3: 150ms;
  --md-sys-motion-duration-short4: 200ms;
  --md-sys-motion-duration-medium1: 250ms;
  --md-sys-motion-duration-medium2: 300ms;
  --md-sys-motion-duration-medium3: 350ms;
  --md-sys-motion-duration-medium4: 400ms;
  --md-sys-motion-duration-long1: 450ms;
  --md-sys-motion-duration-long2: 500ms;
  --md-sys-motion-duration-long3: 550ms;
  --md-sys-motion-duration-long4: 600ms;
```

Because `medium1` changes 200ms→250ms and `medium2` 250ms→300ms, every **existing token
usage** must be remapped to the token that now holds its old value:

| Existing usage | Remap to | Keeps |
| --- | --- | --- |
| `var(--md-sys-motion-duration-medium1)` | `var(--md-sys-motion-duration-short4)` | 200ms |
| `var(--md-sys-motion-duration-medium2)` | `var(--md-sys-motion-duration-medium1)` | 250ms |

`short2` usages are unaffected (value unchanged).

## Repo conventions to follow

- All tokens live in the `:root` block of `react-md3/src/index.css`; there is no
  separate tokens file. Add the new curves/durations there.
- Exemplar of correct usage — `react-md3/src/components/Card/Card.css:28`:
  ```css
  transition: box-shadow var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard),
              background-color var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
  ```
- No var() fallbacks on motion tokens (Card, Checkbox, Tabs etc. omit them; only
  Fab/TopAppBar added them, inconsistently and with wrong values).

## Steps

1. `react-md3/src/index.css:23-28` — replace the motion block with the Target block above.

2. Remap `medium1` usages (200ms intent) to `short4`:
   - `react-md3/src/components/ProgressIndicator/ProgressIndicator.css:33`
     (`transition: width var(--md-sys-motion-duration-medium1) ...`)
   - `react-md3/src/components/ProgressIndicator/ProgressIndicator.css:119`
     (`transition: stroke-dashoffset var(--md-sys-motion-duration-medium1) ...`)
   - `react-md3/src/components/Ripple/Ripple.css:47` — only the `m3-ripple-fade`
     duration: `m3-ripple-fade var(--md-sys-motion-duration-medium1) linear` →
     `m3-ripple-fade var(--md-sys-motion-duration-short4) linear`. **Keep `linear`** —
     it is deliberate for the fade.

3. Remap `medium2` usages (250ms intent) to `medium1`:
   - `react-md3/src/components/Ripple/Ripple.css:38` and `:47` (the `m3-ripple-expand` duration, both occurrences)
   - `react-md3/src/components/Tabs/Tabs.css:92-93` (both lines)
   - `react-md3/src/components/Switch/Switch.css:66`
   - `react-md3/src/components/Sheet/BottomSheet.css:30` and `:42`
   - `react-md3/src/components/Sheet/SideSheet.css:29` and `:57`
   (The four Sheet lines are later replaced wholesale by plan 002; remap them anyway so
   this plan is safe standalone.)

4. Tokenize hand-typed standard curves — replace every `<N>ms cubic-bezier(0.2, 0, 0, 1)`
   (also written `0.3s cubic-bezier(0.2, 0, 0, 1)`) with the matching token pair, where
   200ms→`short4`, 250ms→`medium1`, 300ms→`medium2`, 150ms→`short3`, and the easing
   becomes `var(--md-sys-motion-easing-standard)`:
   - `react-md3/src/components/Button/Button.css:37-40` (4 properties, 200ms each)
   - `react-md3/src/components/ButtonGroup/ButtonGroup.css:39-40` (2 properties, 200ms)
   - `react-md3/src/components/Carousel/Carousel.css:43` (`width 0.3s ...` and `transform 0.3s ...` → `var(--md-sys-motion-duration-medium2)`)
   - `react-md3/src/components/Fab/Fab.css:94` (`transform 250ms ...` → `medium1`)
   - `react-md3/src/components/DateTimePicker/Calendar.css:82` (`transform 200ms ...`)
   - `react-md3/src/components/DateTimePicker/Calendar.css:105` (`m3-dropdown-enter 150ms cubic-bezier(0.2, 0, 0, 1)` → `m3-dropdown-enter var(--md-sys-motion-duration-short3) var(--md-sys-motion-easing-standard)`)
   - `react-md3/src/components/DateTimePicker/DateTimePicker.css:100` (`m3-date-picker-enter 200ms ...` → `short4` + standard)
   - `react-md3/src/components/TimePicker/TimePicker.css:120` area — `animation: m3-fade-in 250ms cubic-bezier(0.2, 0, 0, 1)` → `medium1` + standard
   - `react-md3/src/components/TimePicker/TimePicker.css:294` (`transform 300ms ...` and `width 300ms ...` → `medium2` + standard)
   - `react-md3/src/components/SplitButton/SplitButton.css:111-113` (200ms, all properties) and `:154` (`transform 200ms ...`)
   - `react-md3/src/App.css:135` (`drawer-slide-in 250ms cubic-bezier(0.2, 0, 0, 1)` → `medium1` + standard)

5. Tokenize the emphasized-decelerate hand-type in
   `react-md3/src/components/SplitButton/SplitButton.css:234`:
   ```css
   /* current */
   animation: split-menu-in 200ms cubic-bezier(0.05, 0.7, 0.1, 1) forwards;
   /* target */
   animation: split-menu-in var(--md-sys-motion-duration-short4) var(--md-sys-motion-easing-emphasized-decelerate) forwards;
   ```
   (`ButtonGroup.css:67` also hand-types this curve but that block is rewritten by plan 006 — leave it.)

6. Tokenize generic `ease` (all keep their current ms value; easing becomes
   `var(--md-sys-motion-easing-standard)`; 200ms→`short4`, 150ms→`short3`):
   - `react-md3/src/components/Carousel/Carousel.css:64` (`opacity 0.2s ease` → `short4`)
   - `react-md3/src/components/DateTimePicker/Calendar.css:40`, `:72` (200ms), `:152`, `:220`, `:299` (150ms)
   - `react-md3/src/components/DateTimePicker/DatePickerModal.css:88` (200ms), `:196` (150ms)
   - `react-md3/src/components/TimePicker/TimePicker.css:154`, `:234`, `:372` (200ms), `:396` (150ms)

7. Fix the `ease-in` on the Tabs indicator fade —
   `react-md3/src/components/Tabs/Tabs.css:94`:
   ```css
   /* current */
   opacity 0.1s ease-in;
   /* target */
   opacity var(--md-sys-motion-duration-short2) var(--md-sys-motion-easing-standard);
   ```

8. Remove the contradictory var() fallbacks:
   - `react-md3/src/components/Fab/Fab.css:51-54`: `var(--md-sys-motion-duration-short2, 200ms)` → `var(--md-sys-motion-duration-short2)` and `var(--md-sys-motion-easing-standard, ease)` → `var(--md-sys-motion-easing-standard)` (4 lines)
   - `react-md3/src/components/TopAppBar/TopAppBar.css:14-15`: same two substitutions

## Boundaries

- Do NOT touch these lines/blocks — other plans rewrite them wholesale:
  `Dialog.css` and `FullScreenDialog.css` and `Snackbar.css` animation/keyframe rules
  (plan 003); `BottomSheet.css`/`SideSheet.css` keyframes and `animation:` lines beyond
  the token remap in step 3 (plan 002); `DatePickerModal.css:29-42` enter animation
  (plan 002); `ButtonGroup.css:52-100` check/icon block (plan 006);
  `Fab.css:163` and `Fab.css:172-185` menu block (plan 007).
- Do NOT change any keyframe *contents*, transform values, or which properties animate.
- Do NOT touch `ProgressIndicator`/`LoadingIndicator` indeterminate keyframe timings
  (`2s infinite linear`, `1.5s ease-in-out infinite`) — constant-motion, by design.
- Do NOT add new dependencies or touch any `.tsx` file.
- If a cited line doesn't contain the quoted code (drift since 5c6d25f), STOP and report.

## Verification

- **Mechanical**:
  - `cd react-md3 && npm run lint && npm run test && npm run build` — all pass.
  - `grep -rn "cubic-bezier" react-md3/src --include="*.css" | grep -v "index.css"` →
    only hits inside blocks owned by plans 002/003/006/007 (Dialog, FullScreenDialog,
    Snackbar, Sheet keyframes, ButtonGroup check/icon, DatePickerModal enter). If those
    plans already ran, zero hits.
  - `grep -rnE "[0-9.]+m?s +(ease|ease-in|ease-out)([ ,;]|$)" react-md3/src --include="*.css"` →
    no hits outside plan-owned blocks (the `ease-in-out` on the circular spinner and
    `linear` keywords are allowed).
- **Feel check**: `cd react-md3 && npm run dev` — hover a Button, toggle a Switch, move
  between Tabs, open the SplitButton menu. Everything must feel identical to before
  (this plan changes no durations or shapes except the 100ms Tabs-indicator fade, which
  should now start fading immediately rather than lagging).
- **Done when**: token block matches the M3 spec values above, the greps are clean, and
  the quality gate passes.
