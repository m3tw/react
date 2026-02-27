# Story 1.4: Troubleshooting-Basis fuer Setup- und Integrationsfehler

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Entwickler mit Integrationsproblemen,
I want dokumentierte Fehlerbilder mit klaren Loesungsschritten,
so that ich Blocker schnell und ohne Eskalation beheben kann.

## Acceptance Criteria

1. **Given** typische Setup- und Integrationsfehler  
   **When** ich die Troubleshooting-Abschnitte nutze  
   **Then** finde ich pro Fehlerbild reproduzierbare Diagnose- und Fix-Schritte.
2. **And** die Inhalte decken mindestens Package-Manager-, Build- und Theming-Konflikte ab (FR16).

## Tasks / Subtasks

- [x] Troubleshooting-Informationsarchitektur vereinheitlichen (AC: 1, 2)
  - [x] Bestehende Fehlerbilder in `README.md` und `react-md3/README.md` inventarisieren und auf widerspruchsfreie Struktur mappen.
  - [x] Pro Fehlerklasse ein festes Schema anwenden: Symptom -> Diagnose -> Fix -> Verifikation.
- [x] Package-Manager-Konflikte belastbar dokumentieren (AC: 1, 2)
  - [x] npm/pnpm/yarn/bun-spezifische Stolpersteine aus Story 1.2 uebernehmen und konsolidieren.
  - [x] Corepack-, Lockfile- und "ein Manager pro Working Copy"-Guardrails explizit als Recovery-Pfade festhalten.
- [x] Build- und Theming-Konflikte als reproduzierbare Rezepte abdecken (AC: 1, 2)
  - [x] Typische Build-Fails (Node-Version, Entry/Deep-Import, fehlende Abhaengigkeiten) mit konkreten Kommandos diagnostizieren.
  - [x] Theming-/M3-Integrationsfehler mit klaren Minimal-Fixes und Sichtpruefung im Running-App-Flow beschreiben.
- [x] Troubleshooting-Verifikation und Quality-Gates nachweisen (AC: 1, 2)
  - [x] Dokumentierte Diagnose-/Fix-Schritte gegen den aktuellen Projektstand validieren.
  - [x] In `react-md3` Pflicht-Gates `npm run lint`, `npm run test`, `npm run build` erfolgreich ausfuehren.

## Dev Notes

### Developer Context

- Story 1.4 ist der Stabilitaets-Layer direkt nach Story 1.3: der 5-Minuten-Flow existiert bereits und muss bei Fehlerfaellen robust abgesichert werden.
- Bereits dokumentierte Pfade in Root-README und `react-md3/README.md` sind die primaeren Truth-Sources; Ziel ist Konsolidierung statt paralleler Doku-Inseln.
- Scope ist Troubleshooting-Dokumentation mit reproduzierbaren Diagnose-/Fix-Schritten, nicht Feature- oder Architektur-Neubau.

### Technical Requirements

- Pro Fehlerbild muss ein reproduzierbarer Diagnosepfad vorhanden sein (mindestens ein konkreter Check/Command).
- Pro Fehlerbild muss ein eindeutiger Fixpfad mit Verifikationsschritt dokumentiert sein.
- Mindestabdeckung gemaess AC: Package-Manager-Konflikte, Build-Konflikte, Theming-Konflikte.
- Fehlertexte sollen an realen Artefakten ausgerichtet sein (Scripts, Exportpfade, bestehende Komponentenstruktur), nicht generisch.
- Keine stillen Fehlerpfade: Troubleshooting muss erwartete Fehlersymptome und klare Recovery-Aktionen benennen.

### Architecture Compliance

- Package-API-first bleibt verbindlich: Problem- und Loesungsbeispiele nur ueber Public Barrel (`src/index.ts`), keine Deep-Import-Rezepte.
- Keine Runtime-API, keine Runtime-Datenbank und keine neuen Infrastrukturpfade fuer diese Story.
- Bestehende Struktur in `react-md3/` beibehalten; keine vorgezogene Monorepo-Migration im Rahmen dieser Story.
- Konsistenzregeln aus Architektur gelten weiterhin: klare Fehlerobjekte/-meldungen, keine "silent failures", reproduzierbare Quality-Gates.

### Library / Framework Requirements

- Projekt-Baseline bleibt auf dem bestehenden Stack: `react@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- Node-Basis fuer Reproduzierbarkeit: 24.x LTS (laut Projekt- und Sprint-Kontext aktuell 24.14.0 als aktive LTS-Linie).
- Externe Release-Signale fuer Story-Kontext:
  - React-Doku fuehrt 19.2 als aktuelle Hauptlinie.
  - TypeScript 6.0 ist Beta; 5.9.3 bleibt stabile Linie fuer diese Story.
  - Vite 7.3 ist aktuelle supportete Minor-Linie; Vite 8 befindet sich in Beta.
  - Playwright 1.58.x ist aktuell, beinhaltet aber Breaking Changes in Selektoren/Optionen; fuer Troubleshooting ggf. explizit erwaehnen, ohne jetzt auf neue APIs zu migrieren.
- Package-Manager-Kontext aus Story 1.2 weiterverwenden (npm 11.x, pnpm 10.x, Yarn 4.x, Bun 1.3.x), keine unvalidierten neuen Toolpfade einfuehren.

### File Structure Requirements

- Erwartete Touchpoints:
  - `README.md` (zentrale Troubleshooting-Basis auf Projektebene)
  - `react-md3/README.md` (konkrete Paket-/Runbook-Details)
  - Optional: bestehende Testdateien nur dann anpassen, wenn Verifikationshinweise konkret abgesichert werden muessen
- Keine neuen Doku-Silos oder konkurrierenden Troubleshooting-Dateien ohne klaren Mehrwert.
- Referenzierte Importpfade, Scripts und Commands muessen zum aktuellen Bestand passen (`react-md3/package.json`, `src/index.ts`, `src/components/*`).

### Testing Requirements

- Troubleshooting-Schritte muessen praktisch pruefbar sein (mindestens in Form reproduzierbarer Kommando-/Ergebnisfolgen).
- Doku-Aenderungen duerfen bestehende Entwicklungswege nicht brechen; Verifikation ueber bestehende Pflicht-Gates.
- Verbindliche Gates in `react-md3`: `npm run lint`, `npm run test`, `npm run build`.
- Bei Hinweisen zu Build/Theming-Konflikten immer auch "Erfolg erkannt an ..."-Kriterium dokumentieren (z. B. erwartete App-Ausgabe/Dev-Server-Verhalten).

### Previous Story Intelligence

- Story 1.3 hat den produktiven Einstiegspfad, sichtbare Referenzkomponente und API-Hinweise bereits stabilisiert; Story 1.4 muss darauf aufsetzen statt neue Onboarding-Pfade zu erfinden.
- Story 1.2 liefert bereits belastbare Install-/Import-Fixes (Corepack, Lockfile-Konflikte, Node-Baseline, Barrel-Import). Diese Inhalte sind Primarquellen fuer Package-Manager-Fehlerklassen.
- Wiederkehrendes Muster aus 1.2/1.3: konsistente Root- + Paket-README-Dokumentation, klare Guardrails, kein Deep-Import.
- Quality-Gate-Muster ist etabliert und muss unveraendert bleiben (`lint`, `test`, `build`).

### Git Intelligence Summary

- `b83439e` (Story 1.3 Review): README + `react-md3/README.md` + App-Test/Flow wurden aktualisiert; Troubleshooting muss diese aktuellen Pfade reflektieren.
- `a53fda3` (Story 1.2 Review): Installations-/Import-Absicherung und Story-Artefakte sind vorhanden; kein Neubau, sondern Erweiterung/Konsolidierung fuer Fehlerdiagnose.
- `d2affeb` (Story 1.1 Baseline): Grundstruktur und M3-Referenzkomponente etabliert; Build-/Run-Fixes auf dieser Struktur formulieren.
- Commit-Muster zeigt inkrementelles Vorgehen mit minimalen, zielgerichteten Aenderungen und nachvollziehbaren Story-Artefakten; dieses Muster fuer 1.4 beibehalten.

### Latest Tech Information

- React: `react.dev/versions` fuehrt 19.2 als aktuelle Version; bestehender 19.2-Track bleibt kompatibel.
- TypeScript: Releases zeigen 5.9.3 als stabile Linie und 6.0 Beta als Pre-Release; fuer Story 1.4 keine Beta-Migration.
- Vite: Offizielle Releases zeigen aktive 7.3-Supportlinie und 8.0.0-beta-* Vorab-Releases; Troubleshooting auf 7.3-Basis ausrichten.
- Node.js: Release-Tabelle fuehrt 24.14.0 als Active LTS und 22.22.0 als Maintenance LTS; Story-Validierung auf Node 24.x LTS fokussieren.
- Playwright: 1.58.x ist aktuell; 1.58.0 dokumentiert Breaking Changes bei Selektoren (`_react`, `_vue`, `:light`) und entfernter `devtools`-Option. Bei E2E-Hinweisen diese Bruchstellen klar benennen.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 1.2/1.3, Sprint-Status und aktuelle Git-Historie.

### Project Structure Notes

- Alignment: Story bleibt innerhalb der aktuellen `react-md3`-Struktur und nutzt bestehende README-Hierarchie.
- Variance: Zielarchitektur nennt ein spaeteres Workspace/Monorepo-Modell; diese Story liefert bewusst nur Troubleshooting-Kontext im aktuellen Layout.
- Guardrail: Keine neuen Strukturachsen ohne zwingenden Bedarf; Konsistenz mit bisherigen Story-Artefakten hat Vorrang.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 1.4: Troubleshooting-Basis fuer Setup- und Integrationsfehler]
- [Source: _bmad-output/planning-artifacts/epics.md#Additional Requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#2) Primary User - Edge Case (Alex, Fehler-/Recovery-Pfad)]
- [Source: _bmad-output/planning-artifacts/prd.md#Installation & Setup Experience]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Frontend Architecture]
- [Source: _bmad-output/implementation-artifacts/1-2-verifizierte-installationspfade-fuer-npm-pnpm-yarn-bun.md]
- [Source: _bmad-output/implementation-artifacts/1-3-getting-started-flow-mit-erster-produktiver-komponente.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: README.md]
- [Source: react-md3/README.md]
- [Source: react-md3/package.json]
- [Source: https://react.dev/versions]
- [Source: https://github.com/microsoft/TypeScript/releases]
- [Source: https://vite.dev/releases]
- [Source: https://github.com/vitejs/vite/releases]
- [Source: https://nodejs.org/en/about/previous-releases]
- [Source: https://github.com/microsoft/playwright/releases]

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
- Completion note: Troubleshooting-Dokumentation wurde konsolidiert, validiert und im Senior-Review ohne Findings abgenommen.

### Completion Notes List

- Story-Kontext aus Epics/PRD/Architektur, bisherigen Story-Artefakten und Git-Historie konsolidiert.
- Root-README und `react-md3/README.md` auf ein einheitliches Troubleshooting-Schema (`Symptom -> Diagnose -> Fix -> Verifikation`) umgestellt.
- Package-Manager-Guardrails aus Story 1.2 (Corepack, Lockfiles, ein Manager pro Working Copy) als reproduzierbare Recovery-Pfade dokumentiert.
- Build- und Theming-Konflikte mit konkreten Diagnosekommandos, Minimal-Fixes und sichtbarer Running-App-Verifikation dokumentiert.
- Pflicht-Gates in `react-md3` erneut erfolgreich ausgefuehrt: `npm run lint`, `npm run test`, `npm run build`.

### File List

- _bmad-output/implementation-artifacts/1-4-troubleshooting-basis-fuer-setup-und-integrationsfehler.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- README.md
- react-md3/README.md

### Senior Developer Review (AI)

- Reviewer: Darko
- Date: 2026-02-27
- Outcome: Approved
- Git vs Story Discrepancies: 0 (Story File List deckt den aktuellen Working Tree fuer diese Story vollstaendig ab)
- AC Validation:
  - AC1 erfuellt (pro Fehlerklasse sind reproduzierbare Diagnose-, Fix- und Verifikationsschritte in `README.md` und `react-md3/README.md` dokumentiert)
  - AC2 erfuellt (Package-Manager-, Build- und Theming-Konflikte sind in beiden Troubleshooting-Abschnitten explizit abgedeckt)
- Quality Gates: `npm run lint`, `npm run test`, `npm run build` in `react-md3` erfolgreich ausgefuehrt
- Findings: Keine HIGH/MEDIUM/LOW Findings

## Change Log

- 2026-02-27: Troubleshooting-Struktur in Root- und Paket-README vereinheitlicht, Fehlerklassen fuer Package-Manager/Build/Theming ausgebaut, Quality-Gates verifiziert und Story auf `review` gesetzt.
- 2026-02-27: Senior Developer Review (AI) abgeschlossen, keine Findings, Story auf `done` gesetzt.
