# Story 2.4: Komponenten-Slice C (Navigation/Surfaces) liefern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Frontend-Entwickler,
I want Navigation- und Surface-Komponenten fuer typische App-Strukturen,
so that ich M3-konforme Layout- und Navigationsmuster direkt einsetzen kann.

## Acceptance Criteria

1. **Given** die definierten Navigation-/Surface-Komponenten in diesem Slice  
   **When** ich sie in einem Referenzlayout kombiniere  
   **Then** entsteht ein konsistentes, M3-konformes Nutzererlebnis.
2. **And** die API-Dokumentation deckt Standardnutzung und wichtige Varianten ab (FR1, FR2, FR3, FR4).

## Tasks / Subtasks

- [x] Slice-C-Scope und Public-API-Umfang verbindlich festlegen (AC: 1, 2)
  - [x] Konkrete Komponentenliste fuer Slice C definieren und dokumentieren (mindestens: `TopAppBar`, `NavigationRail`, `NavigationDrawer`, `Surface`).
  - [x] Pro Komponente API-Vertrag festlegen (Props, Varianten, States, Controlled/Uncontrolled-Verhalten).
  - [x] Verbindliche Kombination fuer Referenzlayout festlegen (z. B. AppBar + NavigationRail/Drawer + Surface-Container).
  - [x] Exporte so planen, dass sie zum bestehenden Public-API-Vertrag passen (nur Barrel-Exports, keine Deep-Import-Vertraege).
- [x] Navigation-/Surface-Komponenten nach Projektmuster implementieren (AC: 1)
  - [x] Co-located Struktur je Komponente anlegen (`<Component>.tsx`, `<Component>.test.tsx`, `index.ts`; optional `types.ts`/`constants.ts`).
  - [x] M3-konforme Navigationsmuster umsetzen (klare aktive Ziele, konsistente States, verstaendliche Layout-Hierarchie).
  - [x] Surface-Grundlagen (Elevation/Tonalitaet/Containerstruktur) fuer konsistente Seitenlayouts umsetzen.
  - [x] Semantische HTML-Landmarks und Accessibility-Attribute fuer Navigation/Struktur integrieren (`header`, `nav`, `main`, `aside`, `aria-label`, `aria-current`).
- [x] Referenzlayout und API-Dokumentation fuer Standard + Varianten liefern (AC: 1, 2)
  - [x] In `src/App.tsx` und README ein lauffaehiges Beispiellayout dokumentieren.
  - [x] Wichtige Varianten und Randbedingungen abdecken (mindestens kompakte vs. erweiterte Navigation, aktive Destination, Disabled/Hidden Action).
  - [x] API-Hinweise pro Komponente mit erwarteten Defaults und Grenzen festhalten.
- [x] Test- und Governance-Gates absichern (AC: 1, 2)
  - [x] Pro neuer Komponente mindestens ein Happy-Path-Test und ein Edge-/A11y-relevanter Test.
  - [x] Keyboard-Navigation, Fokusfuehrung und aktive Navigationseintraege testbar nachweisen.
  - [x] `src/components/index.ts`, `src/index.ts` und `src/index.test.ts` mit allen neuen Exports synchronisieren.
  - [x] Bei Public-API-Aenderung `public-api.contract.json` und CHANGELOG-Token konsistent aktualisieren.
  - [x] Pflicht-Gates in `react-md3` ausfuehren: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check`.

## Dev Notes

### Developer Context

- Story 2.4 erweitert Epic 2 von den Action Controls (2.2) auf Layout-/Navigationsbausteine und liefert das erste zusammenhaengende App-Struktur-Pattern im Projekt.
- In `implementation-artifacts` existiert aktuell Story 2.2 als letzte abgeschlossene Story in Epic 2; Story 2.3 ist noch backlog. Diese Story darf daher nicht von nicht umgesetzten 2.3-Artefakten abhaengen.
- Aktuelle Codebasis im Paket `react-md3` enthaelt `Button` und `M3ReferenceCard`; Slice C muss auf diesen bestehenden Konventionen aufbauen statt neue Parallelmuster einzufuehren.

### Technical Requirements

- Navigation- und Surface-Komponenten muessen M3-konformes Verhalten fuer typische App-Strukturen abbilden: klare Informationshierarchie, aktive Ziele, konsistente Interaktionszustande.
- Accessibility ist verpflichtend: Landmark-Semantik, sichtbare Fokusindikatoren, Tastaturbedienung und programmatisch erkennbare aktive Navigation (`aria-current`).
- API-Oberflaechen muessen stabil und typsicher sein (TypeScript), inklusive sauberer Defaults und expliziter Grenzfaelle.
- Keine stillen Failures: ungueltige oder unvollstaendige Konfigurationen muessen ueber klare, testbare Komponentengrenzen handhabbar bleiben.
- Referenzlayout muss als produktionsnahes Integrationsbeispiel dienen (nicht nur isolated Demo-Snippets).

### Architecture Compliance

- Package-API-first gilt unveraendert: oeffentliche API nur ueber Barrel-Exports (`src/components/index.ts` -> `src/index.ts`).
- Keine Runtime-REST/GraphQL-API und keine Runtime-Datenbank im Scope dieser Story.
- Naming-/Strukturregeln aus der Architektur bleiben verbindlich: Komponenten/Dateien in PascalCase, nicht-Komponenten-Pfade in kebab-case.
- Pro neue Komponente sind mindestens Test + Nutzungsbeispiel verpflichtend; Abweichungen nur mit begruendetem ADR-Entscheid.

### Library / Framework Requirements

- Projekt-Baseline in `react-md3/package.json` beibehalten: `react@^19.2.0`, `react-dom@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- React-Dokumentation fuehrt 19.2 als aktuelle Hauptlinie; Story-Implementierung soll auf React-19-kompatiblen Mustern bleiben.
- Vite-Releases weisen `7.3` als aktuelle Minor-Linie mit aktivem Support aus; keine ungeplante Toolchain-Migration innerhalb dieser Story.
- Vitest Guide nennt Node >= 20 als Mindestanforderung; Node-24-LTS-Baseline aus Architektur bleibt dazu kompatibel.
- M3-Navigationskomponenten sollen den offiziellen Material-3-Rollen und Strukturmustern folgen (Navigation Rail als Mid-Screen-Navigation mit klaren Destinationen, strukturierte Accessibility-Landmarks).

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `react-md3/src/components/TopAppBar/TopAppBar.tsx`
  - `react-md3/src/components/TopAppBar/TopAppBar.test.tsx`
  - `react-md3/src/components/TopAppBar/index.ts`
  - `react-md3/src/components/NavigationRail/NavigationRail.tsx`
  - `react-md3/src/components/NavigationRail/NavigationRail.test.tsx`
  - `react-md3/src/components/NavigationRail/index.ts`
  - `react-md3/src/components/NavigationDrawer/NavigationDrawer.tsx`
  - `react-md3/src/components/NavigationDrawer/NavigationDrawer.test.tsx`
  - `react-md3/src/components/NavigationDrawer/index.ts`
  - `react-md3/src/components/Surface/Surface.tsx`
  - `react-md3/src/components/Surface/Surface.test.tsx`
  - `react-md3/src/components/Surface/index.ts`
  - `react-md3/src/components/index.ts`
  - `react-md3/src/index.ts`
  - `react-md3/src/index.test.ts`
  - `react-md3/src/App.tsx`
  - `react-md3/src/App.test.tsx`
  - `react-md3/README.md`
  - `react-md3/public-api.contract.json` und `react-md3/CHANGELOG.md` bei Public-API-Aenderungen
- Keine neue Strukturachse ausserhalb des bestehenden `react-md3/src`-Layouts aufbauen.

### Testing Requirements

- Pro neuer Komponente mindestens:
  - 1 Happy-Path-Test (Rendering + Grundinteraktion)
  - 1 Edge-/A11y-Test (z. B. Keyboard-Navigation, Fokusverlauf, aktive Destination, Landmark-Labeling)
- `src/index.test.ts` muss die oeffentlichen Exports exakt gegen den API-Vertrag verifizieren.
- Referenzlayout in `App` muss mindestens in einem Integrationstest auf zentrale Navigationszustande und semantische Regionen geprueft werden.
- Vor Story-Abschluss verpflichtende Gates im Paket `react-md3`:
  - `npm run lint`
  - `npm run test`
  - `npm run build`
  - `npm run api:contract:check`

### Previous Story Intelligence

- Story 2.2 hat die Delivery-Praxis fuer neue Komponenten etabliert: co-located Komponentenstruktur, Tests + Beispielpflege, Barrel-Exports als einzige Public-API.
- Story 2.2 hat gezeigt, dass API-Contract- und Changelog-Synchronisation harte Merge-Gates sind; Slice-C-Exports muessen von Beginn an mit Vertrag/Gates zusammen gedacht werden.
- Letzter stabiler Pattern-Stand: kleine, nachvollziehbare Inkremente mit enger Kopplung aus Implementierung, Doku und Tests.

### Git Intelligence Summary

- Letzte 5 Commits zeigen eine klare Sequenz aus Story-basierter Umsetzung und Governance-Haertung (`story-2.2` Delivery, davor `story-2.1` API-Contract-Governance).
- Relevantes Muster fuer diese Story: zuerst Public-API-Rahmen und Tests klarziehen, dann Komponenten inkrementell integrieren.
- Bestehende Story-Artefakte in `_bmad-output/implementation-artifacts` werden als Quelle fuer Guardrails und Nachweis der Umsetzung genutzt.

### Latest Tech Information

- React Versionsseite fuehrt 19.2 als aktuelle Hauptlinie; fuer diese Story keine Major-Migration, sondern konsistente Nutzung der bestehenden React-19-Basis.
- Vite Releases: aktuelle Support-Linie ist 7.3; Vite TypeScript-Definitionen koennen sich zwischen Minors aendern, daher bestehende TS/Vite-Baseline stabil halten.
- Vitest Guide: Vitest setzt Vite >= 6 und Node >= 20 voraus; aktuelle Projektkonfiguration liegt innerhalb dieser Grenzen.
- Material Design 3 Navigation Rail Guidance: Rail ist fuer mehrere Destinationen auf mittleren/groesseren Screens gedacht; Story-Scope sollte diese Einsatzgrenzen in API-Beispielen sichtbar machen.
- Material Design Accessibility Foundations: Struktur, Landmarking und klare Navigation sind Teil der Grundprinzipien und muessen in Komponenten-API und Demos nachvollziehbar sein.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Sprint-Status, Story 2.2, Git-Historie und offizielle Tech-/M3-Referenzen.

### Project Structure Notes

- Alignment: Story bleibt im aktuellen Single-Package-Layout (`react-md3/src/*`) mit bestehender Exportkette.
- Variance: Zielarchitektur beschreibt langfristig Workspace/Monorepo (`packages/ui` etc.); Slice C wird bewusst im aktuellen Layout umgesetzt und uebertraegt dieselben Governance-Regeln.
- Guardrail: Public API bleibt ausschliesslich ueber Barrel-Exports sichtbar; keine oeffentlichen Deep-Imports.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.4: Komponenten-Slice C (Navigation/Surfaces) liefern]
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
- [Source: https://react.dev/versions]
- [Source: https://vite.dev/releases]
- [Source: https://vitest.dev/guide/]
- [Source: https://m3.material.io/components/navigation-rail/overview]
- [Source: https://m3.material.io/foundations/designing/overview]

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
- Completion note: Slice C wurde implementiert, inklusive Navigation-/Surface-Komponenten, API-Doku und Governance-Gates.

### Completion Notes List

- `TopAppBar`, `NavigationRail`, `NavigationDrawer` und `Surface` als co-located Komponenten inkl. Happy-Path- und Edge-/A11y-Tests geliefert.
- Referenzlayout in `src/App.tsx` auf M3-konforme Landmarks und Navigation States umgestellt (kompakt/erweitert, aktive Destination, Disabled/Hidden Action).
- Public-API-Synchronisierung abgeschlossen (`src/components/index.ts`, `src/index.test.ts`, `public-api.contract.json`, `CHANGELOG.md`, README).
- Pflicht-Gates in `react-md3` erfolgreich ausgefuehrt: `npm run quality:gate` (inkl. lint, test, build, api:contract:check).

### File List

- _bmad-output/implementation-artifacts/2-4-komponenten-slice-c-navigation-surfaces-liefern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/src/components/TopAppBar/TopAppBar.tsx
- react-md3/src/components/TopAppBar/TopAppBar.test.tsx
- react-md3/src/components/TopAppBar/TopAppBar.css
- react-md3/src/components/TopAppBar/index.ts
- react-md3/src/components/NavigationRail/NavigationRail.tsx
- react-md3/src/components/NavigationRail/NavigationRail.test.tsx
- react-md3/src/components/NavigationRail/NavigationRail.css
- react-md3/src/components/NavigationRail/index.ts
- react-md3/src/components/NavigationDrawer/NavigationDrawer.tsx
- react-md3/src/components/NavigationDrawer/NavigationDrawer.test.tsx
- react-md3/src/components/NavigationDrawer/NavigationDrawer.css
- react-md3/src/components/NavigationDrawer/index.ts
- react-md3/src/components/Surface/Surface.tsx
- react-md3/src/components/Surface/Surface.test.tsx
- react-md3/src/components/Surface/Surface.css
- react-md3/src/components/Surface/index.ts
- react-md3/src/components/index.ts
- react-md3/src/index.test.ts
- react-md3/src/App.tsx
- react-md3/src/App.test.tsx
- react-md3/src/App.css
- react-md3/README.md
- react-md3/public-api.contract.json
- react-md3/CHANGELOG.md

## Senior Developer Review (AI)

### Reviewer

Darko (GPT-5.3-Codex) on 2026-02-27

### Outcome

Approve

### Findings Summary

- Git vs Story File List discrepancies: 0 (26/26 Dateipfade stimmen ueberein).
- High: 0
- Medium: 0
- Low: 0

### Validation Notes

- AC 1 verifiziert ueber das Referenzlayout mit Landmarks/Navigationsstatus in `react-md3/src/App.tsx` und `react-md3/src/App.test.tsx`.
- AC 2 verifiziert ueber Standard-/Varianten-Dokumentation in `react-md3/README.md` sowie Public-API-Abdeckung in `react-md3/src/components/index.ts` und `react-md3/src/index.test.ts`.
- Qualitaetsnachweis erneut ausgefuehrt: `cd react-md3 && npm run quality:gate` (pass).

## Change Log

- 2026-02-27: Story 2.4 von `ready-for-dev` nach `in-progress` ueberfuehrt und Slice-C Implementierung gestartet.
- 2026-02-27: Navigation-/Surface-Slice ausgeliefert, Public-API-Vertrag aktualisiert und `npm run quality:gate` erfolgreich bestanden; Story-Status auf `review` gesetzt.
- 2026-02-27: Senior-Review ohne Findings abgeschlossen; Story-Status auf `done` gesetzt und Sprint-Tracking synchronisiert.
