# Story 3.2: Integrationsrezepte fuer gaengige Team-Setups bereitstellen

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Team mit bestehender React-Toolchain,  
I want konkrete Integrationsrezepte fuer typische Projektkonfigurationen,  
so that ich die Library ohne invasive Umbauten einfuehren kann.

## Acceptance Criteria

1. **Given** mehrere Standard-Setups aus realen Team-Szenarien  
   **When** ich ein passendes Rezept anwende  
   **Then** gelingt die Integration inklusive Build und Theming konsistent.
2. **And** jedes Rezept enthaelt klare Voraussetzungen und Verifikationsschritte (FR17, FR18).

## Tasks / Subtasks

- [x] Integrations-Setups und Rezept-Blueprint verbindlich festlegen (AC: 1, 2)
  - [x] Ziel-Setups definieren (mindestens: bestehende Vite-React-App, vorhandene React-App mit alternativer Toolchain, Team-Workflow mit CI-Reproduktion).
  - [x] Einheitliches Rezeptformat festlegen: `Voraussetzungen -> Schritte -> Verifikation -> Troubleshooting`.
  - [x] Support-Grenzen aus Story 3.1 (Node-/Package-Manager-Matrix) als Guardrail in jedes Rezept einbetten.
- [x] Integrationsrezepte in bestehende Dokumentationspfade integrieren (AC: 1, 2)
  - [x] Root-README um Team-Setup-Rezepte erweitern (`README.md`) als organisationsweite Orientierung.
  - [x] Paket-README um technische, copy-paste-faehige Integrationsablaeufe erweitern (`react-md3/README.md`).
  - [x] Pro Rezept Build- und Theming-Pruefpunkte explizit beschreiben (kein reiner Installationsfokus).
- [x] Konsistenz mit Public API und bestehender Toolchain absichern (AC: 1)
  - [x] Alle Integrationsbeispiele nur ueber Public Barrel (`src/index.ts`) formulieren; keine Deep-Imports.
  - [x] Rezeptschritte mit bestehender Projektrealitaet synchronisieren (`npm|pnpm|yarn|bun`, `quality:gate`, Kompatibilitaetsmatrix).
  - [x] Falls neue Beispielsnippets fuer `src/App.tsx` notwendig sind: API-contract- und Changelog-Governance unverletzt halten.
- [x] Verifikations- und Abnahmepfad pro Rezept operationalisieren (AC: 2)
  - [x] Pro Rezept klare Erfolgsdefinition dokumentieren (Install ok, Build ok, Theming sichtbar korrekt, Tests/Gates gruen).
  - [x] Fehlerklassifikation uebernehmen (Setup-Fehler, Toolchain-Drift, API-Regression) und auf existierende Troubleshooting-Abschnitte verweisen.
  - [x] Abschlussvalidierung mindestens mit `cd react-md3 && npm run quality:gate` dokumentieren.

## Dev Notes

### Developer Context

- Story 3.1 hat die verbindliche Kompatibilitaetsmatrix in CI und README etabliert; Story 3.2 baut darauf auf und liefert den anwendungsnahen Integrationspfad fuer reale Team-Setups.
- Ziel ist nicht neue Runtime-Funktionalitaet, sondern belastbare Integrationsrezepte, die ohne strukturellen Umbau in bestehende React-Toolchains funktionieren.
- Diese Story schliesst die Luecke zwischen Support-Policy (Matrix) und operativer Team-Anwendung (konkrete Schrittfolgen mit Verifikation).

### Technical Requirements

- Jedes Rezept muss die vier Pflichtbloecke enthalten: Voraussetzungen, Integrationsschritte, Verifikation (inkl. Build + Theming), Troubleshooting/Recovery.
- Integrationsanleitungen muessen fuer die offiziell unterstuetzten Package-Manager (`npm`, `pnpm`, `yarn`, `bun`) und das Support-Fenster aus Story 3.1 konsistent bleiben.
- Public API bleibt package-api-first: Beispiele und Anleitungen duerfen nur den oeffentlichen Einstieg verwenden, keine Deep-Import-Pfade.
- Verifikationsschritte muessen reproduzierbar sein und auf bestehende Quality Gates (`lint`, `test`, `build`, `api:contract:check` via `quality:gate`) aufsetzen.

### Architecture Compliance

- Scope bleibt im bestehenden Single-Package-Setup (`react-md3`) mit zentraler Workflow-/Governance-Steuerung auf Repo-Root.
- Keine Erweiterung in Richtung Runtime-API, Datenbank oder Architekturumbau; Fokus bleibt auf Integrationsdokumentation und reproduzierbarer Team-Anwendung.
- Bestehende Architekturregeln bleiben bindend: klare Exportgrenzen, keine stillen Fehlerpfade, keine parallelen "Shadow"-Dokumentationsstandards.

### Library / Framework Requirements

- Projekt-Baselines laut `react-md3/package.json`: `react@^19.2.0`, `react-dom@^19.2.0`, `vite@^7.3.1`, `vitest@^4.0.18`, `typescript~5.9.3`.
- React-Dokumentation fuehrt 19.2 als aktuelle Hauptlinie; Integrationsrezepte muessen React-19-kompatibel formuliert sein.
- Vite-Releases weisen `vite@7.3` als regulaer gepflegte Linie aus; Rezepte sollen ohne veraltete Vite-Annahmen auskommen.
- Vitest fordert `Node >= 20` und `Vite >= 6`; Rezeptvoraussetzungen duerfen keine niedrigere Basis implizieren.
- Node-Release-Status (Stand Recherche): v24 Active LTS, v22 Maintenance LTS; Supportangaben in Rezepten muessen zur Projekt-Matrix passen.
- GitHub-Actions-Matrix-Patterns (`strategy.matrix`, `exclude`) bleiben Referenz fuer CI-nahe Integrationsrezepte.

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `README.md` (Top-Level Team-Setup-Rezepte und Verlinkung)
  - `react-md3/README.md` (technische Rezeptdetails inkl. Befehle und Verifikation)
  - optional `.github/workflows/compatibility-matrix.yml` (nur falls Support-/Policy-Text technisch gespiegelt werden muss)
  - optional `react-md3/src/App.tsx` oder begleitende Beispielpfade (nur wenn fuer konsistente Integrationssnippets erforderlich)
- Keine neuen verstreuten Integrationsquellen ohne klare Verlinkung; bevorzugt bestehende README-Anker erweitern.

### Testing Requirements

- Mindestvalidierung vor Story-Abschluss:
  - `cd react-md3 && npm run quality:gate`
- Falls Rezeptanpassungen Codebeispiele/Imports beeinflussen, zusaetzlich sicherstellen:
  - `cd react-md3 && npm run test`
  - `cd react-md3 && npm run build`
- Story 3.1-Kompatibilitaetsregeln duerfen nicht regressieren; Integrationsrezepte muessen zur Matrix-Dokumentation und CI-Realitaet passen.
- Wenn Public API betroffen waere (nicht erwartet), Contract-/Changelog-Governance zwingend mitziehen.

### Previous Story Intelligence

- Story 3.1 hat als Guardrail festgelegt: unterstuetzte Matrixzellen muessen real gruene Quality-Gates liefern; nicht unterstuetzte Kombinationen muessen explizit dokumentiert sein.
- Dokumentation darf nicht von CI-Policy abweichen; Root-README und Paket-README muessen synchron gepflegt werden.
- Review-Learnings aus 3.1: Toolchain-/Statusangaben regelmaessig gegen Quellen validieren (z. B. Node-Release-Status), und package-manager-spezifische CI-Details nicht pauschalisieren.

### Git Intelligence Summary

- Neuester Commit (`58c728b`) liefert Story 3.1 inklusive `.github/workflows/compatibility-matrix.yml`, `README.md` und `react-md3/README.md`.
- Vorherige Commits (`3354999`, `b88bff0`) zeigen Muster: Komponentenlieferung mit gleichzeitiger Doku-/Contract-Pflege; Integrationsstorys sollten dieses "Doku + Nachweis"-Muster beibehalten.
- Fuer Story 3.2 ist daher ein dokumentationslastiger Change mit klaren Verifikationsbefehlen und minimalem API-Risiko erwartbar.

### Latest Tech Information

- React: aktuelle Hauptlinie 19.2 laut `react.dev/versions`.
- Vite: regulaer gepflegte Linie `7.3`, wichtige/security Backports fuer definierte Vorlinien laut `vite.dev/releases`.
- Vitest: Mindestanforderung `Node >= 20` und `Vite >= 6` laut `vitest.dev/guide`.
- Node.js Releases: v24 = Active LTS, v22 = Maintenance LTS laut `nodejs.org` Release-Tabelle.
- GitHub Actions Matrix-Dokumentation bestaetigt `strategy.matrix` + `exclude` als Standard fuer Variantenvalidierung.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 3.1, aktuelle README-/Workflow-Dateien, Live-Referenzquellen.

### Project Structure Notes

- Alignment: Story 3.2 bleibt innerhalb der aktuellen Struktur (`react-md3` + Root-Governance) und erweitert primaer bestehende Doku-Einstiegspunkte.
- Guardrail: Ein konsistenter Integrationspfad fuer Team-Setups darf nicht in widerspruechliche Mehrfachquellen zerfallen.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.2: Integrationsrezepte fuer gaengige Team-Setups bereitstellen]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3: Integrationsfaehigkeit und Team-Workflow-Kompatibilitaet]
- [Source: _bmad-output/planning-artifacts/prd.md#Integration Requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#Documentation & Example Coverage]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/implementation-artifacts/3-1-kompatibilitaetsmatrix-definieren-und-in-ci-absichern.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: README.md]
- [Source: react-md3/README.md]
- [Source: react-md3/package.json]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: https://react.dev/versions]
- [Source: https://vite.dev/releases]
- [Source: https://vitest.dev/guide/]
- [Source: https://nodejs.org/en/about/previous-releases]
- [Source: https://docs.github.com/actions/using-jobs/using-a-matrix-for-your-jobs]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation: `cd react-md3 && npm run quality:gate`

### Story Completion Status

- Status set to `review`.
- Completion note: Integrationsrezepte fuer Team-Setups umgesetzt und mit Quality-Gate validiert.

### Completion Notes List

- Root-README um Story-3.2-Teamrezepte erweitert (Vite-App, alternative Toolchain, CI-Reproduktion) mit verbindlichem Rezept-Blueprint.
- `react-md3/README.md` um copy-paste-faehige Integrationsablaeufe inkl. Public-API-Guardrails, Build-/Theming-Checks und Fehlerklassifikation ergaenzt.
- Abschlussvalidierung erfolgreich ausgefuehrt: `cd react-md3 && npm run quality:gate`.

### File List

- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/3-2-integrationsrezepte-fuer-gaengige-team-setups-bereitstellen.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-02-27: Story 3.2 aus Sprint-Backlog uebernommen, Kontextdatei erstellt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Story 3.2 implementiert - Integrationsrezepte in Root-/Paket-README erweitert, Guardrails synchronisiert, `quality:gate` erfolgreich.
- 2026-02-27: Senior Developer Review abgeschlossen - keine Findings, Status auf `done` gesetzt, Sprint-Status synchronisiert.

## Senior Developer Review (AI)

### Outcome

- **Approve** - keine High/Medium/Low Findings.

### Validation Evidence

- Git-vs-Story-Abgleich: File List entspricht den tatsaechlichen Aenderungen (`README.md`, `react-md3/README.md`, Story-Datei, `sprint-status.yaml`).
- Acceptance Criteria 1-2 sind umgesetzt: drei Team-Setup-Rezepte mit Pflichtstruktur `Voraussetzungen -> Schritte -> Verifikation -> Troubleshooting`, inkl. Build-/Theming-Verifikation und Support-Guardrails aus Story 3.1.
- Re-Validierung erfolgreich: `cd react-md3 && npm run quality:gate`.

### Follow-ups

- Keine.
