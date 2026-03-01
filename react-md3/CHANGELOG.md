# Changelog

## Migrationsschema (Pflicht bei API-Aenderungen)

- Trigger fuer Pflicht-Migrationseintraege: Deprecation, Breaking Change, relevante Verhaltensaenderung mit Nutzerwirkung.
- Pflichtstruktur je Eintrag:
  - `changeType`
  - `affectedExports`
  - `riskLevel`
  - `migrationGuide` mit Markern `Trigger`, `Migrationsaufwand`, `Alt -> Neu`, `Betroffene Exports/Pfade`, `Verifikation`
- Mapping `changeType -> Migrationstiefe`:
  - `patch`: `Migrationsaufwand: none`
  - `minor`: `Migrationsaufwand: low`
  - `major`: `Migrationsaufwand: high`

## 2026-02-28 - Story 2.6 42/42 Coverage Nachweis

[api-contract-hash:f2c3991357ab858fb6950081d9aee78f97e1feb61a4223de9f59a4a5d74a98a7]

- changeType: minor
- affectedExports: AlertDialog, Badge, BottomSheet, Button, ButtonGroup, ButtonProps, ButtonShape, ButtonSize, ButtonVariant, Card, CardProps, CardVariant, Carousel, Checkbox, Chip, ChipProps, ChipVariant, DatePickerModal, DateTimePicker, Dialog, Divider, DockedToolbar, Fab, FabColor, FabMenuItem, FabProps, FabSize, FabVariant, FloatingToolbar, FullScreenDialog, IconButton, IconButtonProps, IconButtonVariant, List, Menu, NavigationBar, NavigationDrawer, NavigationRail, PlainTooltip, ProgressIndicator, RadioGroup, RichTooltip, Ripple, SearchBar, SideSheet, Slider, Snackbar, SplitButton, Surface, Switch, TabItem, Tabs, TabsLayout, TabsProps, TabsVariant, TextField, Tooltip, TopAppBar
- riskLevel: medium
- migrationGuide: Trigger: additive Public-API-Erweiterung fuer Tabs-Typen; Migrationsaufwand: low; Alt -> Neu: bestehende Runtime-Nutzung bleibt unveraendert, zusaetzlich sind `TabItem`, `TabsLayout`, `TabsProps`, `TabsVariant` ueber den Public Entry verfuegbar; Betroffene Exports/Pfade: alle Public-Exports aus `src/index.ts` (kein Deep-Import); Verifikation: `cd react-md3 && npm run quality:gate`

## 2026-02-27 - Story 2.5 Feedback & Overlay Slice D

[api-contract-hash:51a4e9a56afcc93d35924793c84cca4eff8b0ced36001649a0368e82fa6dfb71]

- changeType: minor
- affectedExports: AlertDialog, Button, Checkbox, Dialog, M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT, NavigationDrawer, NavigationRail, RadioGroup, Snackbar, Surface, TextField, TopAppBar
- riskLevel: low
- migrationGuide: Trigger: additive API-Aenderung; Migrationsaufwand: low; Alt -> Neu: kein Ersatz erforderlich -> `Snackbar`, `Dialog`, `AlertDialog` sind zusaetzlich verfuegbar; Betroffene Exports/Pfade: `AlertDialog`, `Dialog`, `Snackbar` ueber `src/index.ts`; Verifikation: `cd react-md3 && npm run quality:gate`

## 2026-02-27 - Story 2.4 Navigation & Surfaces Slice C

[api-contract-hash:37b8630777bef891a320c12904d7367dfd0c91fa3c18f630f54ea3d0389e05e2]

- changeType: minor
- affectedExports: Button, Checkbox, M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT, NavigationDrawer, NavigationRail, RadioGroup, Surface, TextField, TopAppBar
- riskLevel: low
- migrationGuide: Additive Aenderung; `TopAppBar`, `NavigationRail`, `NavigationDrawer` und `Surface` stehen zusaetzlich zur Verfuegung. Bestehende Imports bleiben unveraendert.

## 2026-02-27 - Story 2.3 Form & Selection Slice B

[api-contract-hash:bebc80d34c4413c78d271773328a5f1c98b1354618ab4a8812011bc23a07063a]

- changeType: minor
- affectedExports: Button, Checkbox, M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT, RadioGroup, TextField
- riskLevel: low
- migrationGuide: Additive Aenderung; `TextField`, `Checkbox` und `RadioGroup` stehen zusaetzlich zur Verfuegung. Bestehende Imports bleiben unveraendert.

## 2026-02-27 - Story 2.2 Action Controls Slice A

[api-contract-hash:6bf8e565dfb10b0976ab7f5330053d6a817715bfdd6ab61e8c8234005b6207bf]

- changeType: minor
- affectedExports: Button, M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT
- riskLevel: low
- migrationGuide: Additive Aenderung; `Button` steht zusaetzlich zur Verfuegung. Bestehende Imports bleiben unveraendert.

## 2026-02-27 - Public API Contract Baseline

[api-contract-hash:0e9bc4205d8c576bc7e4ed68f908b741438831e30f30ec7a973705509dc53bde]

- changeType: minor
- affectedExports: M3ReferenceCard, M3_REFERENCE_FALLBACK_TEXT
- riskLevel: low
- migrationGuide: Keine Migration erforderlich (Initialisierung des API-Vertrags in Story 2.1).
