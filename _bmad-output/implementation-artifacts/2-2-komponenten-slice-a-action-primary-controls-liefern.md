# Story 2.2: Komponenten-Slice A (Action/Primary Controls) liefern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Frontend-Entwickler,
I want zentrale Action-Komponenten mit M3-konformem Verhalten und Theming,
so that ich haeufige Interaktionen produktionsnah umsetzen kann.

## Acceptance Criteria

1. **Given** die definierten Action-Komponenten in diesem Slice  
   **When** ich sie mit Standard- und Custom-Props verwende  
   **Then** verhalten sich die Komponenten konsistent zu Material-3-Prinzipien.
2. **And** pro Komponente existieren mindestens ein Standard- und ein Edge-Case-Beispiel (FR1, FR3, FR4, FR5).

## Tasks / Subtasks

- [x] Slice-A-Scope und Public-API-Umfang verbindlich festlegen (AC: 1)
  - [x] Die konkrete Komponentenliste fuer Slice A im Story-Start explizit festschreiben (Minimum: `Button`; weitere Action Controls gemaess Team-Definition, z. B. `IconButton`/`Fab`).
  - [x] Pro Komponente die benoetigten Props/Varianten/Zustaende dokumentieren (mindestens Default, Disabled, und ein Edge Case).
  - [x] Exportnamen so planen, dass sie in den bestehenden Public-API-Vertrag passen (keine Deep-Import-Vertraege).
- [x] Komponenten nach bestehendem Projektmuster implementieren (AC: 1)
  - [x] Co-located Struktur je Komponente anlegen (`<Component>.tsx`, `<Component>.test.tsx`, `index.ts`; optional `types.ts`/`constants.ts`).
  - [x] M3-konforme Interaktion sicherstellen (semantische Buttons, Fokuszustand, Tastaturbedienbarkeit, konsistente States).
  - [x] Theming-Hooks/Styles konsistent zur bestehenden M3-Ausrichtung einbinden.
- [x] Standard- und Edge-Case-Beispiele pro Komponente liefern (AC: 2)
  - [x] Mindestens ein Happy-Path-Beispiel pro Komponente in den vorhandenen Doku-/Beispielpfad integrieren.
  - [x] Mindestens ein Edge-Case-Beispiel pro Komponente dokumentieren (z. B. disabled/icon-only/loading bzw. vergleichbarer Randfall).
- [x] Qualitaet und Governance absichern (AC: 1, 2)
  - [x] Tests fuer Rendering, Interaktion und Edge Cases je neuer Komponente ergaenzen.
  - [x] `src/components/index.ts`, `src/index.ts` und `src/index.test.ts` auf neue Exports aktualisieren.
  - [x] Bei Public-API-Aenderung `public-api.contract.json` und zugehoerigen Changelog-Token konsistent halten.
  - [x] Pflicht-Gates in `react-md3` erfolgreich ausfuehren: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.

## Dev Notes

### Developer Context

- Story 2.2 ist die erste Feature-Delivery-Story nach der Governance-Story 2.1 und muss deren Public-API-Leitplanken strikt einhalten.
- Der aktuelle Code-Stand enthaelt nur eine Referenzkomponente (`M3ReferenceCard`); Action/Primary Controls werden in dieser Story erstmals als produktive Slice-Bausteine eingefuehrt.
- Fokus ist eine robuste, wiederverwendbare Basis fuer haeufige Interaktionen, nicht die vollstaendige Epic-2-Abdeckung in einer Story.

### Technical Requirements

- Komponenten muessen fuer produktive Nutzung ausgelegt sein: stabile Props, vorhersehbares Verhalten und saubere TypeScript-Typisierung.
- M3-Konformitaet muss in Interaktion und Theming sichtbar sein (State-Verhalten, visuelle Rueckmeldung, konsistente API-Form).
- Pro Komponente sind Standard- und Edge-Case-Beispiele verpflichtend (AC2), damit sowohl Happy Path als auch Fehler-/Randverhalten nachvollziehbar bleiben.
- Public API darf nur ueber Barrel-Exports (`src/index.ts`) bereitgestellt werden; keine Deep-Imports als oeffentlicher Vertrag.
- Fehler- und Randzustaende muessen explizit behandelt werden; keine stillen Failures oder impliziten Defaults ohne klare Dokumentation.

### Architecture Compliance

- Package-API-first bleibt verbindlich: nur Barrel-Exports sind Teil des oeffentlichen Vertrags.
- Keine Runtime-REST/GraphQL-API und keine Runtime-Datenbank im Scope dieser Story.
- Naming-/Strukturregeln aus der Architektur gelten weiter: Komponenten/Dateien in PascalCase, klare Co-Location, konsistente Exportkette.
- Wenn das empfohlene interne Datei-Ordering (`types.ts`, `constants.ts`, `Component.tsx`, `index.ts`) nicht passt, muss die Abweichung begruendet werden.

### Library / Framework Requirements

- Bestehende Projekt-Baseline beibehalten: `react@^19.2.0`, `react-dom@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- Node-Basis fuer lokale/CI-Reproduzierbarkeit: 24.x LTS.
- Fuer Action Controls Accessibility-first umsetzen: semantische Button-Elemente bevorzugen, Tastaturbedienung/Fokus sauber abdecken, ARIA nur dort einsetzen, wo semantisch noetig.
- Public API weiterhin explizit und schlank halten (bewusste Barrel-Exports statt impliziter Re-Exports aus tiefen Pfaden).

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `react-md3/src/components/<Component>/<Component>.tsx`
  - `react-md3/src/components/<Component>/<Component>.test.tsx`
  - `react-md3/src/components/<Component>/index.ts`
  - `react-md3/src/components/index.ts`
  - `react-md3/src/index.ts`
  - `react-md3/src/index.test.ts`
  - `react-md3/src/App.tsx` und/oder `react-md3/README.md` fuer Nutzungsbeispiele
  - `react-md3/public-api.contract.json` und `react-md3/CHANGELOG.md` bei Export-/Governance-Aenderungen
- Keine neue parallele Strukturachse einfuehren; im bestehenden `react-md3/src`-Layout bleiben.

### Testing Requirements

- Pro neuer Komponente mindestens ein Happy-Path-Test und ein Edge-/A11y-relevanter Test.
- Barrel-API-Test (`src/index.test.ts`) muss die dokumentierten oeffentlichen Exports weiterhin exakt widerspiegeln.
- Vor Story-Abschluss sind die verpflichtenden Gates in `react-md3` auszufuehren:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run api:contract:check`
- Beispiele muessen zu den implementierten Props/States passen, damit Doku und API nicht auseinanderlaufen.

### Previous Story Intelligence

- Story 2.1 hat einen verbindlichen Public-API-Vertrag inkl. Deprecation-Policy eingefuehrt; neue Slice-A-Exports muessen dort konsistent angebunden werden.
- Der API-Contract-Check validiert nicht nur Exportnamen, sondern auch Governance-Felder und Contract-Hash-Traceability.
- Aenderungen an Public Exports ohne konsistente Contract-/Changelog-Pflege fuehren zu Gate-Verstoessen.
- Etablierte Arbeitsweise aus den letzten Stories: kleine, nachvollziehbare Schritte mit klarer Doku- und Testkopplung.

### Git Intelligence Summary

- Letzte Commits zeigen ein inkrementelles Muster: Story-Artefakt + gezielte Source-Aenderungen + Sprint-Status-Update.
- Story 2.1 (`f0c6e4c`) hat Governance/Gates geschaerft (`public-api.contract.json`, `scripts/check-api-contract.mjs`, `src/index.test.ts`); diese Guardrails sind fuer 2.2 direkt relevant.
- In Story 1.3/1.4 wurden README- und Beispielpfade konsistent mit Code gepflegt; dieses Muster fuer neue Action Controls beibehalten.

### Latest Tech Information

- React-19-Linie bleibt sinnvoll fuer diese Story; Ref-/Interaktionsmuster sollten mit aktuellen React-Empfehlungen kompatibel sein.
- Vite Library-Mode bleibt der empfohlene Build-Pfad fuer Komponenten-Libraries; keine Abweichung vom bestehenden Toolchain-Setup noetig.
- TypeScript-5.9-Stabilitaet beibehalten; keine Beta-/Major-Migrationen im Rahmen dieser Story.
- Fuer Button-aehnliche Controls gilt weiterhin: semantische Elemente, Keyboard-/Fokus-Verhalten, klare API-Oberflaeche und testbare A11y-Grundlagen.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, Architektur, PRD, Product Brief, Story 2.1, Sprint-Status, Git-Historie und aktuelle Tech-Hinweise.

### Project Structure Notes

- Alignment: Umsetzung bleibt im aktuellen Single-Package-Layout (`react-md3/src/*`) mit bestehender Barrel-Export-Kette.
- Variance: Zielarchitektur beschreibt langfristig ein Workspace/Monorepo-Modell (`packages/ui` etc.); Story 2.2 bleibt bewusst im aktuellen Layout und setzt die Regeln analog um.
- Guardrail: Public API nur ueber `src/index.ts`; keine oeffentlichen Deep-Imports.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.2: Komponenten-Slice A (Action/Primary Controls) liefern]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Vollstaendige M3-Komponentenabdeckung mit stabiler API]
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/planning-artifacts/prd.md#Component Delivery & Usage]
- [Source: _bmad-output/planning-artifacts/product-brief-react-2026-02-26.md#Proposed Solution]
- [Source: _bmad-output/planning-artifacts/research/technical-react-md3-shadcn-style-library-research-2026-02-26.md#Technical Research Recommendations]
- [Source: _bmad-output/implementation-artifacts/2-1-public-api-vertrag-und-deprecation-policy-etablieren.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: react-md3/package.json]
- [Source: react-md3/src/index.ts]
- [Source: react-md3/src/components/index.ts]
- [Source: react-md3/src/index.test.ts]
- [Source: https://react.dev/blog/2024/12/05/react-19]
- [Source: https://vite.dev/guide/build#library-mode]
- [Source: https://www.typescriptlang.org/docs/]
- [Source: https://vitest.dev/guide/]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Implementation Plan

- Slice-A fuer diese Story verbindlich auf `Button` festgelegt, inklusive States: Default, Disabled, Loading (Edge Case).
- Public-API-Kette ueber Barrel-Exports gehalten (`src/components/index.ts` -> `src/index.ts`), keine Deep-Import-Vertraege.
- M3-nahe Interaktion/Theming ueber semantisches `<button>`, Fokus-Styles (`:focus-visible`) und Varianten (`filled`, `tonal`, `text`) umgesetzt.

### Story Completion Status

- Status set to `done`.
- Completion note: Slice-A `Button` wurde implementiert, reviewed und mit API-Vertrag/Quality-Gates abgesichert.

### Completion Notes List

- `Button` als erste Action-Komponente in Co-Location-Struktur implementiert (`Button.tsx`, `Button.test.tsx`, `Button.css`, `index.ts`).
- Standard- und Edge-Case-Nutzung fuer `Button` in `src/App.tsx` und `react-md3/README.md` dokumentiert (Default/Disabled/Loading).
- Public-API-Governance aktualisiert: `src/components/index.ts`, `src/index.test.ts`, `public-api.contract.json`, `CHANGELOG.md`.
- Pflicht-Gates erfolgreich ausgefuehrt: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.

### File List

- _bmad-output/implementation-artifacts/2-2-komponenten-slice-a-action-primary-controls-liefern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/src/components/Button/Button.tsx
- react-md3/src/components/Button/Button.test.tsx
- react-md3/src/components/Button/Button.css
- react-md3/src/components/Button/index.ts
- react-md3/src/components/index.ts
- react-md3/src/index.test.ts
- react-md3/src/App.tsx
- react-md3/src/App.test.tsx
- react-md3/src/App.css
- react-md3/README.md
- react-md3/public-api.contract.json
- react-md3/CHANGELOG.md

### Senior Developer Review (AI)

- Review-Modus: adversarial (YOLO)
- Ergebnis: 3 Medium Findings identifiziert und behoben.
- Findings/Fixes:
  - README-Barrel-Hinweis war unvollstaendig (`src/components/index.ts` nannte nur `M3ReferenceCard`) -> auf `M3ReferenceCard` + `Button` korrigiert.
  - README-Import-Snippet war inkonsistent zu den Button-Beispielen -> `Button` im Import ergaenzt.
  - Testabdeckung hatte Luecken fuer Disabled+Custom-Variant sowie App-Level-Button-Beispiele -> `Button.test.tsx` und `App.test.tsx` erweitert.
- AC-Validierung: AC1 und AC2 sind nachweisbar implementiert (Komponente, Beispiele, Tests, Gates).

## Change Log

- 2026-02-27: Story 2.2 als `ready-for-dev` erstellt (vollstaendiger Dev-Kontext, Guardrails, Testing-/Governance-Anforderungen und Referenzen).
- 2026-02-27: Story 2.2 umgesetzt (`Button` Slice-A inkl. Tests/Beispiele), Public-API-Vertrag aktualisiert und Quality-Gates erfolgreich bestanden.
- 2026-02-27: Senior Developer Review (AI) ausgefuehrt, Medium Findings behoben und Story auf `done` gesetzt.
