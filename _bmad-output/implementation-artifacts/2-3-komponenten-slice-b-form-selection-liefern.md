# Story 2.3: Komponenten-Slice B (Form/Selection) liefern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Frontend-Entwickler,
I want Form- und Selection-Komponenten mit klaren Interaktionsmustern,
so that ich Eingabe- und Auswahlflows robust implementieren kann.

## Acceptance Criteria

1. **Given** die definierten Form-/Selection-Komponenten in diesem Slice  
   **When** ich Validierungs-, Disabled- und Error-Zustaende nutze  
   **Then** sind Verhalten und Darstellung konsistent und dokumentiert.
2. **And** die Edge-Case-Zustaende sind testbar ueber bereitgestellte Beispiele (FR1, FR3, FR4, FR5, FR15).

## Tasks / Subtasks

- [x] Slice-B-Scope und Public-API-Umfang verbindlich festlegen (AC: 1, 2)
  - [x] Konkrete Komponentenliste fuer Slice B definieren und dokumentieren (mindestens: `TextField`, `Checkbox`, `RadioGroup`; optional erweiterbar um `Select` bei gesicherter API-Qualitaet).
  - [x] Pro Komponente API-Vertrag festlegen (Props, Controlled/Uncontrolled-Verhalten, States, Validierungsverhalten).
  - [x] Verbindliche Error-/Validation- und Disabled-Patterns festschreiben (inkl. erwarteter ARIA-Signale).
  - [x] Exporte so planen, dass sie zum bestehenden Public-API-Vertrag passen (nur Barrel-Exports, keine Deep-Import-Vertraege).
- [x] Form-/Selection-Komponenten nach Projektmuster implementieren (AC: 1)
  - [x] Co-located Struktur je Komponente anlegen (`<Component>.tsx`, `<Component>.test.tsx`, `index.ts`; optional `types.ts`/`constants.ts`).
  - [x] M3-konforme Interaktionsmuster umsetzen (Fokus, Disabled, Error, Labeling, konsistente Zustandsdarstellung).
  - [x] API-Design robust halten: klare Defaults, keine stillen Fehlerpfade, typsichere Props.
  - [x] Wiederverwendung bestehender Styling-/Komponentenmuster sicherstellen (keine parallelen Architekturpfade).
- [x] Standard- und Edge-Case-Beispiele fuer Eingabe-/Auswahlflows liefern (AC: 1, 2)
  - [x] In `src/App.tsx` und `react-md3/README.md` pro Komponente mindestens ein Standardbeispiel bereitstellen.
  - [x] Mindestens einen Edge Case pro Komponente dokumentieren (z. B. Error-Text, invalid state, disabled + required, leerer initial state).
  - [x] Beispiele so strukturieren, dass sie direkt als Integrationsreferenz fuer reale Form-Flows nutzbar sind.
- [x] Test- und Governance-Gates absichern (AC: 1, 2)
  - [x] Pro neuer Komponente mindestens ein Happy-Path-Test und ein Edge-/A11y-relevanter Test.
  - [x] Tests fuer Validierung, Error-State und Disabled-Verhalten sowie Keyboard-Interaktion ergaenzen.
  - [x] `src/components/index.ts`, `src/index.ts` und `src/index.test.ts` mit allen neuen Exports synchronisieren.
  - [x] Bei Public-API-Aenderung `public-api.contract.json` und CHANGELOG-Token konsistent aktualisieren.
  - [x] Pflicht-Gates in `react-md3` ausfuehren: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.

## Dev Notes

### Developer Context

- Story 2.3 baut direkt auf der abgeschlossenen Story 2.2 auf und erweitert Epic 2 von Action Controls auf Form-/Selection-Patterns.
- Aktueller Stand in `react-md3`: produktive Komponenten `Button` und `M3ReferenceCard`; Slice B soll diese etablierten Muster fortsetzen statt neue Parallelkonzepte einzufuehren.
- Story 2.4 ist bereits als `ready-for-dev` vorbereitet, Story 2.3 ist jedoch der naechste backlog-Schritt fuer Eingabe-/Auswahlgrundlagen in Epic 2.

### Technical Requirements

- Form-/Selection-Komponenten muessen konsistente Interaktionszustaende abdecken: Default, Focus, Disabled, Error, optional Validation-Hinweis.
- A11y ist verpflichtend: semantische Form-Elemente, eindeutige Labels, nachvollziehbare Fehlermeldungen und saubere Tastaturbedienbarkeit.
- API-Oberflaechen muessen klar und typsicher sein (TypeScript), inklusive dokumentierter Controlled/Uncontrolled-Pfade.
- Edge Cases muessen explizit behandelt und testbar sein; keine stillen Failures oder impliziten "success-shaped" Defaults bei ungueltigen Kombinationen.
- Beispielnutzung muss produktionsnah bleiben (nicht nur isolierte Demo-Snippets).

### Architecture Compliance

- Package-API-first bleibt verbindlich: oeffentliche API nur ueber Barrel-Exports (`src/components/index.ts` -> `src/index.ts`).
- Keine Runtime-REST/GraphQL-API und keine Runtime-Datenbank im Scope dieser Story.
- Naming-/Strukturregeln aus der Architektur gelten weiter: Komponenten/Dateien PascalCase, Co-Location pro Komponente, konsistente Exportkette.
- Pro neue Komponente sind mindestens Test und Nutzungsbeispiel verpflichtend; Abweichungen nur mit dokumentiertem ADR-Bezug.

### Library / Framework Requirements

- Projekt-Baseline gemaess `react-md3/package.json` beibehalten: `react@^19.2.0`, `react-dom@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- React 19 ist stabil; fuer Formularinteraktionen koennen aktuelle React-Patterns (inkl. Action-/Pending-Patterns) genutzt werden, ohne Major-Migration.
- Vite Library-Mode-Guardrails bleiben bestehen (Rollup-basierter Build, Public API bewusst ueber Entry-Barrel halten).
- Vitest bleibt mit Node >= 20 kompatibel; Node-24-LTS-Baseline des Projekts bleibt passend.
- Form-/Selection-Implementierung soll Material-3-konforme Zustandskommunikation (Error/Support/Disabled) in API und Beispielnutzung sichtbar machen.

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `react-md3/src/components/TextField/TextField.tsx`
  - `react-md3/src/components/TextField/TextField.test.tsx`
  - `react-md3/src/components/TextField/index.ts`
  - `react-md3/src/components/Checkbox/Checkbox.tsx`
  - `react-md3/src/components/Checkbox/Checkbox.test.tsx`
  - `react-md3/src/components/Checkbox/index.ts`
  - `react-md3/src/components/RadioGroup/RadioGroup.tsx`
  - `react-md3/src/components/RadioGroup/RadioGroup.test.tsx`
  - `react-md3/src/components/RadioGroup/index.ts`
  - Optional bei Scope-Freigabe: `react-md3/src/components/Select/*`
  - `react-md3/src/components/index.ts`
  - `react-md3/src/index.ts`
  - `react-md3/src/index.test.ts`
  - `react-md3/src/App.tsx`
  - `react-md3/src/App.test.tsx`
  - `react-md3/README.md`
  - `react-md3/public-api.contract.json` und `react-md3/CHANGELOG.md` bei Public-API-Aenderungen
- Keine neue Strukturachse ausserhalb des bestehenden `react-md3/src`-Layouts einziehen.

### Testing Requirements

- Pro neuer Komponente mindestens:
  - 1 Happy-Path-Test (Rendering + Standardinteraktion)
  - 1 Edge-/A11y-Test (z. B. Error-Text, Label-Verknuepfung, Keyboard-Bedienung, Disabled-Schutz)
- Validierungs- und Error-Zustaende muessen in Tests explizit nachgewiesen werden (AC1/AC2).
- `src/index.test.ts` muss die oeffentlichen Exports exakt gegen den API-Vertrag pruefen.
- Vor Story-Abschluss verpflichtende Gates im Paket `react-md3`:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run api:contract:check`

### Previous Story Intelligence

- Story 2.2 hat die Delivery-Blueprints gesetzt: co-located Komponentenstruktur, test-first fuer States und konsequente Barrel-Export-Disziplin.
- Story 2.2 hat gezeigt, dass API-Contract-Check und Changelog-Token harte Gates sind; neue Slice-B-Exports muessen von Beginn an damit synchronisiert werden.
- Etabliertes Muster: inkrementelle Umsetzung mit enger Kopplung aus Implementierung, Doku-Beispielen und Tests.

### Git Intelligence Summary

- Die letzten Commits zeigen ein konsistentes Story-Muster: Story-Artefakt + gezielte Source-Aenderungen + Sprint-Status-Aktualisierung.
- `feat(story-2.2)` liefert relevante Referenzmuster fuer Komponentenstruktur, Tests und API-Vertragspflege.
- `chore(story-2.1)` verankert Governance/Contract-Gates, die fuer Slice B weiterhin bindend sind.

### Latest Tech Information

- React 19 ist stabil; offizielle Guidance betont konsistente Action-/Form-Patterns und sauberes Pending/Error-Handling in Formularfluesen.
- Vite Build-Dokumentation beschreibt Library-Mode und Rollup-Optionen als Standardpfad fuer Library-Builds; bestehende Toolchain bleibt passend.
- Vitest Guide bestaetigt Mindestanforderungen Vite >= 6 und Node >= 20; Projektkonfiguration mit Vite 7 und Node 24 ist kompatibel.
- Fuer Form-Komponenten bleibt Accessibility-first zentral: native Form-Semantik und testbare Label-/Error-Kommunikation.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Sprint-Status, Story 2.2, Git-Historie und aktuelle Tech-Referenzen.

### Project Structure Notes

- Alignment: Story bleibt im aktuellen Single-Package-Layout (`react-md3/src/*`) mit bestehender Exportkette.
- Variance: Zielarchitektur beschreibt langfristig ein Workspace/Monorepo-Modell (`packages/ui` etc.); Story 2.3 bleibt bewusst im aktuellen Layout und uebernimmt dieselben Guardrails.
- Guardrail: Public API bleibt ausschliesslich ueber Barrel-Exports sichtbar; keine oeffentlichen Deep-Imports.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.3: Komponenten-Slice B (Form/Selection) liefern]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Vollstaendige M3-Komponentenabdeckung mit stabiler API]
- [Source: _bmad-output/planning-artifacts/prd.md#Component Delivery & Usage]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: _bmad-output/implementation-artifacts/2-2-komponenten-slice-a-action-primary-controls-liefern.md]
- [Source: react-md3/package.json]
- [Source: react-md3/src/components/index.ts]
- [Source: react-md3/src/index.ts]
- [Source: react-md3/src/index.test.ts]
- [Source: https://react.dev/blog/2024/12/05/react-19]
- [Source: https://vite.dev/guide/build#library-mode]
- [Source: https://vitest.dev/guide/]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Story Completion Status

- Status set to `done`.
- Completion note: Story 2.3 wurde implementiert, adversarial reviewed und inkl. Review-Fixes erneut gegen alle Quality-Gates validiert.

### Completion Notes List

- TextField, Checkbox und RadioGroup als co-located Komponenten inklusive M3-konformer States (Focus, Disabled, Error, Supporting Text) implementiert.
- Pro neuer Komponente Happy-Path- und Edge-/A11y-Tests ergaenzt; Export-Barrel und Public-API-Tests synchronisiert.
- Integrationsbeispiele in `src/App.tsx` und `react-md3/README.md` um Standard- und Edge-Case-Form/Selection-Flows erweitert.
- API-Governance aktualisiert (`public-api.contract.json`, `CHANGELOG.md`) und Quality-Gates erfolgreich ausgefuehrt: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.

### Change Log

- 2026-02-27: Story 2.3 implementiert (Form/Selection Slice B) und auf `review` gesetzt.
- 2026-02-27: Senior Developer Review (AI, YOLO) durchgefuehrt, 3 Medium Findings behoben und Story auf `done` gesetzt.
- 2026-02-27: Follow-up Senior Developer Review (AI, YOLO) erneut ausgefuehrt, keine neuen Findings.

### File List

- _bmad-output/implementation-artifacts/2-3-komponenten-slice-b-form-selection-liefern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/CHANGELOG.md
- react-md3/README.md
- react-md3/public-api.contract.json
- react-md3/src/App.css
- react-md3/src/App.test.tsx
- react-md3/src/App.tsx
- react-md3/src/components/Checkbox/Checkbox.css
- react-md3/src/components/Checkbox/Checkbox.test.tsx
- react-md3/src/components/Checkbox/Checkbox.tsx
- react-md3/src/components/Checkbox/index.ts
- react-md3/src/components/RadioGroup/RadioGroup.css
- react-md3/src/components/RadioGroup/RadioGroup.test.tsx
- react-md3/src/components/RadioGroup/RadioGroup.tsx
- react-md3/src/components/RadioGroup/index.ts
- react-md3/src/components/TextField/TextField.css
- react-md3/src/components/TextField/TextField.test.tsx
- react-md3/src/components/TextField/TextField.tsx
- react-md3/src/components/TextField/index.ts
- react-md3/src/components/index.ts
- react-md3/src/index.test.ts

### Senior Developer Review (AI)

- Review-Modus: adversarial (YOLO)
- Ergebnis: 3 Medium Findings identifiziert und behoben.
- Findings/Fixes:
  - RadioGroup-Keyboard-Test war ein False-Positive (vorselektierter Wert machte den Nachweis wirkungslos) -> `RadioGroup.tsx` um explizite Arrow-Key-Navigation ergaenzt, Test auf echte zustandsaendernde Keyboard-Interaktion umgestellt.
  - Disabled-Verhalten war fuer `TextField` nicht explizit testabgedeckt -> Disabled-Edge-Case-Test in `TextField.test.tsx` ergaenzt.
  - Disabled-Optionen waren fuer `RadioGroup` nicht explizit testabgedeckt -> Disabled-Option-Test in `RadioGroup.test.tsx` ergaenzt.
- AC-Validierung: AC1 und AC2 sind nachweisbar implementiert (Komponenten, Beispiele, Tests, Quality-Gates).
- Follow-up-Review (YOLO): kein zusaetzlicher Handlungsbedarf; keine neuen High/Medium/Low Findings.
