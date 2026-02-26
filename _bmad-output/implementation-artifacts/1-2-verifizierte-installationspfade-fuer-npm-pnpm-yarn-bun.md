# Story 1.2: Verifizierte Installationspfade fuer npm/pnpm/yarn/bun

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Entwickler in unterschiedlichen Team-Setups,
I want klare, getestete Installationsanleitungen fuer alle unterstuetzten Package-Manager,
so that ich die Library in meinem bestehenden Workflow reproduzierbar installieren kann.

## Acceptance Criteria

1. **Given** die offiziell unterstuetzten Package-Manager  
   **When** ich den dokumentierten Installationspfaden folge  
   **Then** kann ich die Library in jedem Pfad erfolgreich installieren und importieren.
2. **And** die Anleitung enthaelt verifizierte Befehle und Mindestvoraussetzungen pro Tool (FR6, FR8).

## Tasks / Subtasks

- [x] Support- und Prerequisite-Matrix fuer npm/pnpm/yarn/bun festziehen (AC: 1, 2)
  - [x] Node-Baseline und kompatible Package-Manager-Major-Versionen verbindlich dokumentieren.
  - [x] Paketquelle und exakten Paketnamen aus Manifest/Release-Kontext ableiten (keine Platzhalter).
- [x] Installationspfade pro Manager reproduzierbar verifizieren (AC: 1)
  - [x] Fuer jeden Manager frische Installations- und Import-Sanity-Checks definieren und ausfuehren.
  - [x] Corepack-/Lockfile-Strategie fuer reproduzierbare Runs festlegen, wo relevant.
- [x] Doku fuer alle vier Installationswege aktualisieren (AC: 2)
  - [x] Root-README um dedizierte Multi-Manager-Abschnitte erweitern.
  - [x] Haeufige Fehlerbilder (Install/Import) mit klaren Diagnose- und Fix-Hinweisen dokumentieren.
- [x] Qualitaets- und Nachweislauf sichern (AC: 1, 2)
  - [x] In `react-md3` mindestens `npm run lint`, `npm run test`, `npm run build` erfolgreich ausfuehren.
  - [x] Ergebnisse und Verifikationskontext in Story-/PR-Notizen nachvollziehbar festhalten.

## Dev Notes

### Developer Context

- Story 1.2 baut direkt auf der abgeschlossenen Baseline aus Story 1.1 auf.
- Primarer Scope: reproduzierbare Installations- und Import-Pfade fuer npm/pnpm/yarn/bun inklusive verifizierter Dokumentation.
- Kein Feature-Ausbau an Runtime-Komponenten; Fokus auf verifizierte Setup- und Integrationsfaehigkeit.

### Technical Requirements

- Alle vier Package-Manager muessen einen klaren, verifizierten Install- und Importpfad erhalten.
- Mindestvoraussetzungen (Node + Toolversionen) muessen explizit und konsistent dokumentiert werden.
- Keine geratenen Paketnamen/Befehle: nur aus realem Manifest- oder Release-Kontext ableiten.
- Fehlerbehandlung darf nicht still scheitern; jede Diagnose braucht konkrete Handlungsschritte.

### Architecture Compliance

- Package-API-first bleibt verbindlich; keine Runtime-API und keine Runtime-Datenbank einfuehren.
- Import-Validierung gegen den oeffentlichen Einstieg (Barrel-Export via `src/index.ts`) ausrichten.
- Vorhandene Struktur in `react-md3/` erhalten; keine vorgezogene Monorepo-Umstrukturierung in dieser Story.

### Library / Framework Requirements

- Aktuelle Projektbasis: React 19.2.x, TypeScript 5.9.x, Vite 7.3.x, Vitest 4.0.x.
- Node LTS 24.x als bevorzugte Validierungsbasis fuer reproduzierbare Installationspfade.
- Falls Corepack eingesetzt wird (pnpm/yarn), Versionen projektbezogen pinnen und in Doku klar markieren.

### File Structure Requirements

- Voraussichtliche Touchpoints:
  - `README.md` (Multi-Manager-Installationsanleitungen)
  - `react-md3/README.md` (projektlokale Setup- und Caveat-Ergaenzungen)
  - `react-md3/package.json` (nur falls Verifikationsskripte ergaenzt werden)
  - optionale Skript-/Workflow-Dateien fuer Install-Matrix-Checks
- Keine bestehenden Verzeichnisse umbenennen oder ohne Not neue Strukturachsen einfuehren.

### Testing Requirements

- Jeder Managerpfad braucht einen nachvollziehbaren Install+Import-Nachweis.
- Bestehende Quality Gates in `react-md3` bleiben Pflicht: `npm run lint`, `npm run test`, `npm run build`.
- Verifikationsskripte muessen deterministisch, CI-faehig und ohne manuelle Sonderpfade laufen.

### Previous Story Intelligence

- Story 1.1 hat eine lauffaehige Baseline und verifizierte Lint/Test/Build-Laeufe etabliert.
- Etablierte Guardrails: Barrel-Exports statt Deep-Imports, klare Fehlersignale statt silent failures.
- Aktueller Implementierungsfokus liegt praktisch in `react-md3/`; Story 1.2 soll migrationsarm darauf aufbauen.

### Git Intelligence Summary

- Letzter fachlicher Commit (`d2affeb`) hat Story-1.1-Baseline, README und `react-md3/*` konsistent aufgebaut.
- Historie zeigt aktuell npm-first Doku; diese Story erweitert gezielt auf pnpm/yarn/bun statt parallele Sonderwege zu erfinden.
- Sprint- und Story-Artefakte werden bereits versioniert gepflegt; diesen Pfad weiter nutzen.

### Latest Tech Information

- React stabile Linie: 19.2.x; TypeScript stabile Linie: 5.9.x (6.0 weiterhin Beta-Track).
- Vite 7.x verlangt moderne Node-Versionen; Node 24 LTS ist fuer dieses Projekt ein robuster Zielwert.
- Package-Manager-Baselines im aktuellen Oekosystem: npm 11.x, pnpm 10.30.x, Yarn 4.x, Bun 1.3.x.
- Vor finalen Befehlen stets gegen offizielle Release-/Install-Dokumentation abgleichen.

### Project Context Reference

- `**/project-context.md` wurde nicht gefunden; Story-Kontext basiert auf Epics, PRD, Architektur, Story 1.1 und Git-Historie.

### Project Structure Notes

- Alignment: Story bleibt kompatibel mit aktueller `react-md3/`-Struktur und respektiert den spaeteren Move-Pfad Richtung `packages/ui`.
- Variance-Risiko: Architektur beschreibt Monorepo-Zielbild; diese Story behandelt es als Zukunftspfad und verhindert verfruehte Strukturmigration.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.2: Verifizierte Installationspfade fuer npm/pnpm/yarn/bun]
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/prd.md#Installation & Setup Experience]
- [Source: _bmad-output/implementation-artifacts/1-1-projekt-initialisierung-mit-vite-react-ts-starter.md]
- [Source: README.md]
- [Source: react-md3/package.json]
- [Source: https://github.com/facebook/react/releases]
- [Source: https://github.com/Microsoft/TypeScript/releases]
- [Source: https://vite.dev/releases]
- [Source: https://vite.dev/guide/migration]
- [Source: https://pnpm.io/installation]
- [Source: https://yarnpkg.com/]
- [Source: https://bun.sh/]
- [Source: https://nodejs.org/en/download]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow: `_bmad/core/tasks/workflow.xml`
- Skill workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Sprint tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Manager verification workspace: `.tmp-manager-check/*` (temporaer, nach Verifikation entfernt)

### Story Completion Status

- Status set to `review`.
- Completion note: Story 1.2 vollstaendig umgesetzt, inkl. verifizierter Multi-Manager-Installationspfade und Quality-Gates.

### Completion Notes List

- Root-README um Support-/Prerequisite-Matrix fuer npm/pnpm/yarn/bun, exakte Paketquelle (`./react-md3`) und Paketnamen (`react-md3`) erweitert.
- Frische Install+Build-Verifikation in separaten Arbeitskopien fuer npm, pnpm, yarn und bun erfolgreich ausgefuehrt.
- Reproduzierbarkeitsleitplanken dokumentiert (Corepack fuer pnpm/yarn, ein Manager pro Working Copy, Lockfile-Konflikte aktiv vermeiden).
- Import-Sanity ueber Public-API-Barrel zusaetzlich mit `react-md3/src/index.test.ts` abgesichert.
- Pflicht-Quality-Gates erfolgreich: `npm run lint`, `npm run test`, `npm run build` in `react-md3`.

### File List

- README.md
- _bmad-output/implementation-artifacts/1-2-verifizierte-installationspfade-fuer-npm-pnpm-yarn-bun.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- react-md3/src/components/M3ReferenceCard/M3ReferenceCard.test.tsx
- react-md3/src/index.test.ts

### Change Log

- 2026-02-26: Story 1.2 implementiert (verifizierte npm/pnpm/yarn/bun Installationspfade, Prerequisite-Matrix, Troubleshooting und Import-Sanity-Erweiterung).
- 2026-02-26: Verifikation abgeschlossen mit frischen Manager-Installationen (npm/pnpm/yarn/bun) und erfolgreichem Quality-Gate-Lauf (`lint`, `test`, `build`).
- 2026-02-26: Senior-Developer-Review (AI) abgeschlossen, keine Findings, Status auf `done` gesetzt.

### Senior Developer Review (AI)

- Reviewer: Darko
- Ergebnis: APPROVED
- Findings: 0 (High: 0, Medium: 0, Low: 0)
- AC-/Task-Validierung: Alle Acceptance Criteria umgesetzt, [x]-Tasks plausibel belegt, Git-Realitaet konsistent zur File List.
