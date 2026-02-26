# Story 1.1: Projekt-Initialisierung mit Vite React-TS Starter

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Frontend-Entwickler,
I want ein initialisiertes Projekt auf Basis des festgelegten Starters,
so that ich ohne Setup-Blocker direkt mit der ersten produktiven Komponente starten kann.

## Acceptance Criteria

1. **Given** ein leeres Repository mit Node.js LTS  
   **When** ich den Starter-Befehl ausfuehre und das Projekt starte  
   **Then** laeuft die Anwendung lokal erfolgreich mit einer ersten renderbaren M3-Referenzkomponente.
2. **And** der Initialisierungsweg ist als erster Implementierungsschritt nachvollziehbar dokumentiert (FR6, FR7).

## Tasks / Subtasks

- [x] Projektbasis mit Vite React-TS Starter erzeugen (AC: 1)
  - [x] Projekt mit `npm create vite@latest react-md3 -- --template react-ts` initialisieren.
  - [x] Abhaengigkeiten installieren und lokale Ausfuehrung via Dev-Server verifizieren.
  - [x] Starter-Struktur auf Architektur-Konformitaet fuer spaetere Monorepo-Einbettung pruefen.
- [x] Erste renderbare M3-Referenzkomponente bereitstellen (AC: 1)
  - [x] Eine produktiv nutzbare Referenzkomponente im UI-Pfad anlegen (inkl. Export ueber Barrel-Entry).
  - [x] Sicherstellen, dass Komponente lokal sichtbar rendert und keine Setup-Blocker erzeugt.
- [x] Mindestqualitaet und Testfaehigkeit fuer den Startpfad herstellen (AC: 1)
  - [x] Mindestens einen Happy-Path-Test und einen A11y-/Edge-Case-Test fuer die erste Komponente vorbereiten.
  - [x] Ausfuehrbarkeit der Kernskripte fuer Build/Test dokumentieren.
- [x] Initialisierungsweg als ersten Implementierungsschritt dokumentieren (AC: 2)
  - [x] README/Getting-Started um exakte Befehlsfolge, Voraussetzungen und Verifikationsschritte erweitern.
  - [x] Klar kennzeichnen, dass dies Story 1.1 und Startpunkt fuer die Folge-Stories ist.

## Dev Notes

### Developer Context

- Story 1.1 ist die Foundation fuer alle Folgearbeiten in Epic 1; Scope strikt auf lauffaehigen Projektstart + erste referenzierbare M3-Komponente begrenzen.
- Keine Runtime-API und keine Runtime-Datenbank einbauen; Architektur ist package-first und token-first.
- Keine Deep-Imports; oeffentliche API nur ueber zentrale Barrel-Exports pflegen.

### Technical Requirements

- Starter bleibt `vite` + `react-ts`; kein Wechsel auf alternatives Starter-Template in dieser Story.
- Laufzeit-/Tooling-Baseline aus Architektur beachten: Node.js LTS 24.14.0, pnpm 10.30.2, Changesets 2.29.8.
- Fehlerbehandlung ohne silent failure; Setup-Fehler mit klarer Ursache dokumentieren.

### Architecture Compliance

- Projektstruktur auf Zielbild ausrichten: mittelfristig `apps/` + `packages/` Monorepo mit klaren Grenzen.
- Komponentenstruktur beibehalten: `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`.
- Naming-Regeln strikt einhalten: Komponenten/Dateien PascalCase, Funktionen/Hooks camelCase.

### Library / Framework Requirements

- React: 19.2.4 als aktuelle stabile Referenz.
- TypeScript: 5.9.3 (6.0 ist Beta, daher fuer produktive Storys nicht einsetzen).
- Vite: 7.3.x als stabile Linie; keine 8.x-Beta fuer diese Story.
- Qualitaetsstack fuer Folgearbeiten (hier vorbereiten, nicht zwingend voll ausbauen): Storybook 10.2.12, Vitest 4.0.x, Playwright 1.58.x.

### File Structure Requirements

- Voraussichtliche Touchpoints in dieser Story:
  - Projekt-Root: `package.json`, `README.md`, ggf. `tsconfig*`, `vite.config.*`
  - UI-Pfad fuer erste Referenzkomponente: `packages/ui/src/components/*` (oder aequivalenter initialer `src/components/*` Pfad, falls Monorepo-Schnitt in Folgestory finalisiert wird)
  - Barrel-Export: `packages/ui/src/index.ts` (oder initial `src/index.ts`) als einziger Public-API-Einstieg
- Keine ad-hoc Ordner ausserhalb der Architekturkonventionen anlegen.

### Testing Requirements

- Merge-Gate-Zielbild bereits jetzt mitdenken: Unit + Interaction + E2E-Smoke + A11y-Nachweis.
- Minimum je neuer Komponente: 1 Happy-Path-Test + 1 A11y-/Edge-Case-Test.
- Beispiele und Tests muessen reproduzierbar laufen und mit Dokumentation konsistent bleiben.

### Latest Tech Information

- React 19 bringt relevante API-Aenderungen (u. a. `useActionState`, Suspense-Verhalten, neue Server-/Activity-Funktionen); neue Implementierungen sollen auf React-19-Patterns ausgerichtet sein.
- TypeScript 6.0 ist noch Beta; stabile Basis bleibt 5.9.x fuer diesen Story-Umfang.
- Vite 8 ist Beta; stabile Umsetzung weiter auf 7.3.x.
- Storybook 10 ist ESM-only und fordert moderne Node-Versionen; Konfigurationsdateien entsprechend ESM-faehig halten.

### Project Structure Notes

- Alignment: Story folgt dem in der Architektur definierten Zielbild (Vite-basierter Start, danach monorepo-faehige Struktur, klare Exportgrenzen).
- Potenzieller Variance-Punkt: Falls initial noch kein vollstaendiges `apps/`/`packages/` Layout steht, muss der gewaehlte Zwischenstand klar als temporaer markiert und migrationsarm gehalten werden.

### Project Context Reference

- Kein `project-context.md` im Repository gefunden (`**/project-context.md` ohne Treffer). Entscheidungen basieren auf PRD, Epics und Architektur.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 1]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.1: Projekt-Initialisierung mit Vite React-TS Starter]
- [Source: _bmad-output/planning-artifacts/architecture.md#Selected Starter: Vite React-TS Starter]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: https://github.com/facebook/react/releases]
- [Source: https://github.com/Microsoft/TypeScript/releases]
- [Source: https://vite.dev/releases]
- [Source: https://github.com/storybookjs/storybook/releases]
- [Source: https://playwright.dev/docs/release-notes]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow: `_bmad/core/tasks/workflow.xml`
- Skill-Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Sprint-Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Completion Notes List

- Ultimate context engine analysis completed - comprehensive developer guide created
- Story wurde auf `ready-for-dev` vorbereitet, inklusive Guardrails gegen Scope-Drift und Architekturverletzungen.
- Story 1.1 wurde in `react-md3/` umgesetzt und gegen lokale Setup-Blocker verifiziert.
- Erste M3-Referenzkomponente ist sichtbar in der App integriert und ueber Barrel-Exports verfuegbar.
- Test-/Qualitaetsbaseline wurde mit Vitest eingerichtet; `npm run test`, `npm run build` und `npm run lint` laufen erfolgreich.

### File List

- README.md
- _bmad-output/implementation-artifacts/1-1-projekt-initialisierung-mit-vite-react-ts-starter.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/.gitignore
- react-md3/eslint.config.js
- react-md3/index.html
- react-md3/package-lock.json
- react-md3/package.json
- react-md3/public/vite.svg
- react-md3/README.md
- react-md3/src/App.css
- react-md3/src/App.tsx
- react-md3/src/assets/react.svg
- react-md3/src/components/M3ReferenceCard/M3ReferenceCard.test.tsx
- react-md3/src/components/M3ReferenceCard/M3ReferenceCard.tsx
- react-md3/src/components/M3ReferenceCard/index.ts
- react-md3/src/components/index.ts
- react-md3/src/index.css
- react-md3/src/index.ts
- react-md3/src/main.tsx
- react-md3/src/test/setup.ts
- react-md3/tsconfig.app.json
- react-md3/tsconfig.json
- react-md3/tsconfig.node.json
- react-md3/vite.config.ts
- react-md3/vitest.config.ts

### Senior Developer Review (AI)

- Reviewer: Darko (AI), 2026-02-26
- Outcome: Approve after fix
- Findings:
  - [MEDIUM] Dev Agent Record → File List war unvollstaendig gegenueber den tatsaechlich geaenderten Applikationsdateien in `react-md3/`.
- Fixes:
  - File List um alle fehlenden, tatsaechlich geaenderten Starter-/Applikationsdateien erweitert.
- Validation:
  - `npm run lint` ✅
  - `npm run test` ✅
  - `npm run build` ✅

### Change Log

- 2026-02-26: Story 1.1 implementiert (Vite React-TS Bootstrap, M3-Referenzkomponente, Test-Setup, README Getting-Started).
- 2026-02-26: Senior Developer Review (AI) abgeschlossen, File-List-Diskrepanz behoben und Story-Status auf `done` gesetzt.
