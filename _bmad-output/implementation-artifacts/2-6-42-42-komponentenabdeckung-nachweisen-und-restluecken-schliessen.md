# Story 2.6: 42/42-Komponentenabdeckung nachweisen und Restluecken schliessen

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Library-Maintainer,
I want eine verifizierbare Coverage-Matrix zur Material-3-Komponenten-Referenzliste inklusive Umsetzungsplan fuer Restluecken,
so that die Einhaltung des 42/42-MVP-Ziels nachvollziehbar, messbar und releasefaehig ist.

## Acceptance Criteria

1. **Given** die PRD-Referenzliste mit 42 Eintraegen  
   **When** ich Coverage-Matrix und Implementierungsstand pruefe  
   **Then** ist jeder Eintrag entweder einer implementierten Komponente zugeordnet oder als Luecke mit priorisiertem Umsetzungsplan dokumentiert.
2. **And** der Abschlusszustand fuer diese Story ist erst bei nachweisbarer 42/42-Abdeckung erreicht (FR1, FR14, FR15).

## Tasks / Subtasks

- [x] Canonical 42er-Referenz und Coverage-Matrix verbindlich aufsetzen (AC: 1, 2)
  - [x] Die PRD-Referenzliste mit exakt 42 Eintraegen als maschinenlesbare Quelle im Repo verankern (verbatim, nachvollziehbar versioniert).
  - [x] Mapping-Regeln fuer Sammelbegriffe/Varianten festlegen (z. B. `All buttons`, `Buttons`, `Icon buttons`) und als Teil der Matrix dokumentieren.
  - [x] Einen Coverage-Check als Script implementieren, der bei fehlenden, mehrdeutigen oder doppelt gezaehlten Zuordnungen fehlschlaegt.
  - [x] Baseline-Report erzeugen: Ist-Stand, offene Restluecken, Prioritaet und geplanter Umsetzungsweg je Luecke.
- [x] Restluecken zur 42/42-Abdeckung liefern und in den Public Surface integrieren (AC: 1, 2)
  - [x] Fehlende Komponenten/Varianten priorisiert implementieren und in bestehende Co-Location-Struktur einordnen.
  - [x] Pro neuer Komponente mindestens Standard- und Edge-Case-/Fehlerfall-Beispiel bereitstellen (FR14, FR15).
  - [x] Public-Barrel-Exports (`src/components/index.ts`, `src/index.ts`) und API-Contract synchron nachziehen.
  - [x] API-Lifecycle- und Changelog-Regeln bei Public-API-Aenderungen strikt einhalten.
- [x] Nachweise in Doku, Demo und Governance-Gates konsistent verankern (AC: 1, 2)
  - [x] `react-md3/README.md` um eine nachvollziehbare 42/42-Coverage-Darstellung erweitern (inkl. Gap-/Done-Status je Eintrag).
  - [x] `src/App.tsx` und zugehoerige Tests so aktualisieren, dass neue Kernkomponenten sichtbar und verifizierbar sind.
  - [x] Sicherstellen, dass FR1/FR14/FR15 in der finalen Doku-Abdeckung explizit referenziert werden.
- [x] Qualitaets- und Integrations-Gates fuer den 42/42-Nachweis ausfuehren (AC: 1, 2)
  - [x] Pflichtlauf im Paket `react-md3`: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.
  - [x] Bei Coverage-Gate-Ergaenzung den Lauf in den bestehenden Guardrail integrieren (kein Shadow-Gate ausserhalb von `quality:gate`).
  - [x] Integrationssicherheit mit `cd react-md3/reference-integration && npm ci && npm run ci:smoke` validieren.

## Dev Notes

### Developer Context

- Epic 2 ist bereits in Stories 2.1 bis 2.5 vorangeschritten; Story 2.6 ist der harte Nachweis- und Abschluss-Checkpoint fuer die in PRD geforderte 42/42-Abdeckung.
- Der aktuelle Public Surface enthaelt 13 Exports, davon 12 komponentenartige Exports (`AlertDialog`, `Button`, `Checkbox`, `Dialog`, `M3ReferenceCard`, `NavigationDrawer`, `NavigationRail`, `RadioGroup`, `Snackbar`, `Surface`, `TextField`, `TopAppBar`) plus `M3_REFERENCE_FALLBACK_TEXT`.
- Aus der PRD-Referenzliste (42 Eintraege, verbatim) folgt: die Story muss eine belastbare Bruecke von aktuellem Implementierungsstand zu vollständiger Referenzabdeckung herstellen.

### Technical Requirements

- Die projektinterne Source of Truth fuer den 42/42-Nachweis ist die PRD-Liste (`_bmad-output/planning-artifacts/prd.md`), nicht eine dynamische externe Zaehllogik.
- Jeder der 42 PRD-Eintraege braucht eine eindeutige Zuordnung:  
  1) `implemented` mit konkretem Export/Beispielnachweis oder  
  2) `gap` mit priorisiertem Umsetzungsplan.
- Mehrdeutige Sammelbegriffe muessen explizit ueber Mapping-Regeln aufgeloest werden; implizites Zaehlen ist nicht zulaessig.
- Story gilt erst als `done`, wenn die Matrix fuer alle 42 Eintraege den Zustand `implemented` nachweist und die Nachweise reproduzierbar durch Tests/Gates bestaetigt sind.
- Keine stillen Fallbacks bei Matrix-Validierung: unvollstaendige oder widerspruechliche Zuordnungen muessen den Check rot machen.

### Architecture Compliance

- Public API nur ueber Barrel (`src/components/index.ts` -> `src/index.ts`), keine oeffentlichen Deep-Import-Vertraege.
- Komponenten strikt co-located aufbauen (`<Component>.tsx`, `<Component>.test.tsx`, optional Stylesheet, `index.ts`).
- Naming-Konventionen beibehalten: Komponenten/Dateien PascalCase, Funktionen camelCase.
- Keine Runtime-REST/GraphQL-API und keine Runtime-Datenbank im Scope.
- Bestehende Governance-Mechanismen (API-Contract + Changelog + Quality Gates) sind bindend und duerfen nicht umgangen werden.

### Library / Framework Requirements

- Repo-Baseline laut `react-md3/package.json`: `react@^19.2.0`, `react-dom@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- Support-Fenster laut `react-md3/README.md`: Node 22.x/24.x; Node 20 bleibt ausgeschlossen in der Kompatibilitaetsmatrix.
- Teststack fuer neue Komponenten: Testing Library + Vitest, inklusive A11y-/Edge-Case-Abdeckung.
- WAI-ARIA-Dialogmuster (Focus-Management, labeling, `aria-modal`) bleiben fuer Overlay-Komponenten verpflichtend; neue Komponenten duerfen diese Guardrails nicht regressieren.
- Externe M3-Dokumentation nennt "over 30" Komponenten; fuer dieses Projekt bleibt die PRD-Liste mit 42 Eintraegen die verbindliche Zieldefinition.

### File Structure Requirements

- Wahrscheinliche Haupt-Touchpoints:
  - `react-md3/scripts/check-m3-coverage.mjs` (neu)
  - `react-md3/package.json` (Script-/Gate-Einbindung)
  - `react-md3/README.md` (Coverage-Matrix + Nachweise)
  - `react-md3/src/App.tsx`
  - `react-md3/src/App.test.tsx`
  - `react-md3/src/App.css` (falls neue Demo-Segmente benoetigt)
  - `react-md3/src/components/<ComponentName>/<ComponentName>.tsx`
  - `react-md3/src/components/<ComponentName>/<ComponentName>.test.tsx`
  - `react-md3/src/components/<ComponentName>/<ComponentName>.css` (falls erforderlich)
  - `react-md3/src/components/<ComponentName>/index.ts`
  - `react-md3/src/components/index.ts`
  - `react-md3/src/index.ts`
  - `react-md3/src/index.test.ts`
  - `react-md3/public-api.contract.json`
  - `react-md3/CHANGELOG.md`
- Story-Artefakt und Tracking:
  - `_bmad-output/implementation-artifacts/2-6-42-42-komponentenabdeckung-nachweisen-und-restluecken-schliessen.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Pro neu gelieferter Komponente mindestens:
  - 1 Happy-Path-Test
  - 1 Edge-/A11y-Test
- Coverage-Matrix braucht einen reproduzierbaren Verifikationsmechanismus (Script/Test), der 42/42 deterministisch prueft.
- Public-API-Konsistenz weiterhin ueber `src/index.test.ts` und `api:contract:check` absichern.
- Pflicht-Gates vor Story-Abschluss:
  - `cd react-md3 && npm run quality:gate`
  - `cd react-md3/reference-integration && npm ci && npm run ci:smoke`

### Previous Story Intelligence

- Story 2.5 hat den Delivery-Standard gefestigt: Co-Location, API-Vertragsdisziplin, README-/Demo-Synchronisierung und verpflichtende Gate-Laeufe.
- Ein konkretes 2.5-Review-Finding war fehlender Fokus-Test bei `AlertDialog`; daraus folgt fuer 2.6: A11y- und Interaktionsnachweise muessen von Anfang an testbar eingebaut werden.
- Das Muster "Implementierung + Doku + Contract + Tests gemeinsam" ist etabliert und muss bei jeder neuen Komponente beibehalten werden.

### Git Intelligence Summary

- Aktuelle Commits zeigen, dass Toolchain-/CI-Stabilitaet aktiv gepflegt wird (z. B. Yarn-PnP-Fixes, Symlink-/CI-Anpassungen).
- Daraus folgt fuer 2.6: keine ad-hoc Toolchain-Abweichungen; neue Scripts/Gates muessen mit bestehender Matrix- und CI-Logik kompatibel bleiben.
- Juengste Story-Abschluesse (Epic 5) bestaetigen das Muster, Story-Artefakte, README und `sprint-status.yaml` konsistent mitzupflegen.

### Latest Tech Information

- React bleibt auf der 19.x-Hauptlinie; projektspezifisch ist `^19.2.0` konfiguriert.
- Vite 7.x und Vitest 4.x sind im Repo aktiv; Node-22/24-Supportfenster bleibt verbindlich.
- WAI-ARIA APG fordert fuer `dialog`/`alertdialog` weiterhin Focus-Management (Initialfokus, Fokusfalle, Fokus-Rueckgabe).
- Material Design 3 dokumentiert eine breite, evolvierende Komponentenlandschaft; fuer die Story-Zielerreichung ist ausschliesslich die PRD-42er-Referenz massgeblich.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Sprint-Status, Story 2.5, aktueller Public API Contract, aktueller Komponentenbestand, Git-Historie und aktuelle Web-Referenzen.

### Project Structure Notes

- Aktueller Implementierungspfad bleibt im bestehenden Single-Package-Layout `react-md3/src/*`.
- Zielarchitektur beschreibt langfristig ein Workspace-/Monorepo-Modell; Story 2.6 liefert kompatibel dazu im bestehenden Layout ohne Parallelstruktur.
- Guardrail bleibt: keine neuen oeffentlichen Importpfade ausserhalb des Public Barrels.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.6: 42/42-Komponentenabdeckung nachweisen und Restluecken schliessen]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Vollstaendige M3-Komponentenabdeckung mit stabiler API]
- [Source: _bmad-output/planning-artifacts/prd.md#Material-3-Komponenten-Referenzliste (verbatim)]
- [Source: _bmad-output/planning-artifacts/prd.md#Functional Requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: _bmad-output/implementation-artifacts/2-5-komponenten-slice-d-feedback-overlay-liefern.md]
- [Source: react-md3/package.json]
- [Source: react-md3/src/components/index.ts]
- [Source: react-md3/src/index.test.ts]
- [Source: react-md3/public-api.contract.json]
- [Source: react-md3/README.md]
- [Source: https://react.dev/versions]
- [Source: https://vite.dev/blog/announcing-vite7]
- [Source: https://vitest.dev/guide/]
- [Source: https://m3.material.io/components]
- [Source: https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/]
- [Source: https://www.w3.org/WAI/ARIA/apg/patterns/alertdialog/]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Coverage Gate: `react-md3/scripts/check-m3-coverage.mjs`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Story Completion Status

- Status set to `review`.
- 42/42-Coverage-Matrix, Public API und Doku/Demo-Nachweise sind reproduzierbar abgeschlossen.

### Completion Notes List

- Canonical 42er-Quelle (`scripts/m3-reference-list.json`) und Mapping-Matrix (`scripts/m3-coverage-matrix.json`) sind als versionierte Source of Truth verankert.
- Deterministischer Coverage-Check (`scripts/check-m3-coverage.mjs`) validiert fehlende, mehrdeutige und doppelt gezaehlte Zuordnungen und erzeugt den Baseline-Report (`docs/m3-coverage-baseline.md`).
- Fehlende Komponenten/Varianten wurden co-located geliefert (`Badge`, `ButtonGroup`, `Carousel`, `Chip`, `DateTimePicker`, `Divider`, `Fab`, `IconButton`, `List`, `Menu`, `NavigationBar`, `ProgressIndicator`, `SearchBar`, `Sheet`, `Slider`, `Switch`, `Tabs`, `Tooltip`) inkl. Happy-/Edge-Case-Tests.
- Public-Barrel, API-Contract und Changelog wurden synchronisiert; README enthaelt mit Abschnitt 6.16 den FR1/FR14/FR15-Nachweis inkl. Done-Status je Referenzeintrag.
- Gates erfolgreich ausgefuehrt: `cd react-md3 && npm run quality:gate` sowie `cd react-md3/reference-integration && npm ci && npm run ci:smoke`.

### File List

- _bmad-output/implementation-artifacts/2-6-42-42-komponentenabdeckung-nachweisen-und-restluecken-schliessen.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/CHANGELOG.md
- react-md3/README.md
- react-md3/docs/m3-coverage-baseline.md
- react-md3/package.json
- react-md3/public-api.contract.json
- react-md3/scripts/check-m3-coverage.mjs
- react-md3/scripts/m3-coverage-matrix.json
- react-md3/scripts/m3-reference-list.json
- react-md3/src/App.css
- react-md3/src/App.test.tsx
- react-md3/src/App.tsx
- react-md3/src/components/Badge/Badge.css
- react-md3/src/components/Badge/Badge.test.tsx
- react-md3/src/components/Badge/Badge.tsx
- react-md3/src/components/Badge/index.ts
- react-md3/src/components/ButtonGroup/ButtonGroup.css
- react-md3/src/components/ButtonGroup/ButtonGroup.test.tsx
- react-md3/src/components/ButtonGroup/ButtonGroup.tsx
- react-md3/src/components/ButtonGroup/index.ts
- react-md3/src/components/Carousel/Carousel.css
- react-md3/src/components/Carousel/Carousel.test.tsx
- react-md3/src/components/Carousel/Carousel.tsx
- react-md3/src/components/Carousel/index.ts
- react-md3/src/components/Chip/Chip.css
- react-md3/src/components/Chip/Chip.test.tsx
- react-md3/src/components/Chip/Chip.tsx
- react-md3/src/components/Chip/index.ts
- react-md3/src/components/DateTimePicker/DateTimePicker.css
- react-md3/src/components/DateTimePicker/DateTimePicker.test.tsx
- react-md3/src/components/DateTimePicker/DateTimePicker.tsx
- react-md3/src/components/DateTimePicker/index.ts
- react-md3/src/components/Divider/Divider.css
- react-md3/src/components/Divider/Divider.test.tsx
- react-md3/src/components/Divider/Divider.tsx
- react-md3/src/components/Divider/index.ts
- react-md3/src/components/Fab/Fab.css
- react-md3/src/components/Fab/Fab.test.tsx
- react-md3/src/components/Fab/Fab.tsx
- react-md3/src/components/Fab/index.ts
- react-md3/src/components/IconButton/IconButton.css
- react-md3/src/components/IconButton/IconButton.test.tsx
- react-md3/src/components/IconButton/IconButton.tsx
- react-md3/src/components/IconButton/index.ts
- react-md3/src/components/List/List.css
- react-md3/src/components/List/List.test.tsx
- react-md3/src/components/List/List.tsx
- react-md3/src/components/List/index.ts
- react-md3/src/components/Menu/Menu.css
- react-md3/src/components/Menu/Menu.test.tsx
- react-md3/src/components/Menu/Menu.tsx
- react-md3/src/components/Menu/index.ts
- react-md3/src/components/NavigationBar/NavigationBar.css
- react-md3/src/components/NavigationBar/NavigationBar.test.tsx
- react-md3/src/components/NavigationBar/NavigationBar.tsx
- react-md3/src/components/NavigationBar/index.ts
- react-md3/src/components/ProgressIndicator/ProgressIndicator.css
- react-md3/src/components/ProgressIndicator/ProgressIndicator.test.tsx
- react-md3/src/components/ProgressIndicator/ProgressIndicator.tsx
- react-md3/src/components/ProgressIndicator/index.ts
- react-md3/src/components/SearchBar/SearchBar.css
- react-md3/src/components/SearchBar/SearchBar.test.tsx
- react-md3/src/components/SearchBar/SearchBar.tsx
- react-md3/src/components/SearchBar/index.ts
- react-md3/src/components/Sheet/Sheet.css
- react-md3/src/components/Sheet/Sheet.test.tsx
- react-md3/src/components/Sheet/Sheet.tsx
- react-md3/src/components/Sheet/index.ts
- react-md3/src/components/Slider/Slider.css
- react-md3/src/components/Slider/Slider.test.tsx
- react-md3/src/components/Slider/Slider.tsx
- react-md3/src/components/Slider/index.ts
- react-md3/src/components/Switch/Switch.css
- react-md3/src/components/Switch/Switch.test.tsx
- react-md3/src/components/Switch/Switch.tsx
- react-md3/src/components/Switch/index.ts
- react-md3/src/components/Tabs/Tabs.css
- react-md3/src/components/Tabs/Tabs.test.tsx
- react-md3/src/components/Tabs/Tabs.tsx
- react-md3/src/components/Tabs/index.ts
- react-md3/src/components/Tooltip/Tooltip.css
- react-md3/src/components/Tooltip/Tooltip.test.tsx
- react-md3/src/components/Tooltip/Tooltip.tsx
- react-md3/src/components/Tooltip/index.ts
- react-md3/src/components/index.ts
- react-md3/src/index.test.ts

### Change Log

- 2026-02-28: Senior-Developer-Review (AI) durchgefuehrt; 2 Medium Findings behoben (DateTimePicker controlled/uncontrolled Input, Slider eindeutige IDs), Status auf `done` gesetzt.
- 2026-02-28: Story auf `review` gesetzt; 42/42-Coverage-Matrix, Coverage-Gate, Public-API-Sync und Demo-/Doku-Nachweise umgesetzt.
- 2026-02-28: Story 2.6 als `ready-for-dev` mit umfassendem Implementierungskontext erstellt.

## Senior Developer Review (AI)

### Reviewer

- Darko (AI-Assisted Review via GPT-5.3-Codex)

### Scope

- Story 2.6 gegen Implementierung und Gates geprueft.
- Geaenderte Source-Dateien in `react-md3/` inklusive neuer Komponenten-Slices, Coverage-Scripts und Demo-Integration gecheckt.
- Review fokussiert auf reale Bugs/Regressionsrisiken; `_bmad/` und `_bmad-output/` wurden nicht als Source-Code bewertet.

### Findings

1. **MEDIUM (fixed)** `react-md3/src/components/DateTimePicker/DateTimePicker.tsx` nutzte gleichzeitig `value` und `defaultValue` am Input.
   - Fix: kontrolliertes/unkontrolliertes Muster vereinheitlicht (`isControlled`, interner State), konfliktfreies `value`-Handling umgesetzt.
   - Test ergaenzt: `DateTimePicker.test.tsx` prueft Priorisierung von controlled `value`.
2. **MEDIUM (fixed)** `react-md3/src/components/Slider/Slider.tsx` erzeugte IDs aus Label-Text und konnte bei gleichen Labels kollidieren.
   - Fix: `useId()` fuer stabile, eindeutige ID-Vergabe eingefuehrt.
   - Test ergaenzt: `Slider.test.tsx` validiert eindeutige IDs bei mehrfacher Label-Wiederverwendung.

### Verification

- `cd react-md3 && npm run test -- src/components/DateTimePicker/DateTimePicker.test.tsx src/components/Slider/Slider.test.tsx`
- `cd react-md3 && npm run quality:gate`
- `cd react-md3/reference-integration && npm run ci:smoke`

### Outcome

- **Approved**: Alle HIGH/MEDIUM Findings sind behoben, ACs bleiben nachweisbar erfuellt.
