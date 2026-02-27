# Story 4.1: Release-Checkliste und harte Quality Gates definieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Maintainer,  
I want eine verbindliche Release-Checkliste mit messbaren Gate-Kriterien,  
so that Stable-Releases nur bei nachgewiesener Qualitaet freigegeben werden.

## Acceptance Criteria

1. **Given** definierte Release-Kriterien fuer Bugs, API-Stabilitaet und Doku-Konsistenz  
   **When** ein Release vorbereitet wird  
   **Then** werden alle Kriterien gegen eine einheitliche Checkliste bewertet.
2. **And** fehlende Kriterien blockieren die Freigabe nachvollziehbar (FR21, FR22, FR23).

## Tasks / Subtasks

- [x] Release-Checkliste als Single Source of Truth definieren (AC: 1, 2)
  - [x] Verbindliche Gate-Kategorien festlegen: kritische Defekte, API-/Contract-Konsistenz, Beispiel-/Doku-Konsistenz, Security, Freigabeentscheidung.
  - [x] Fuer jedes Gate messbare Schwellenwerte, Datenquelle, Evidenz und Verantwortlichkeit dokumentieren.
  - [x] Harte Blocker-Regel verankern: fehlende oder rote Gate-Evidenz => kein Stable-Release.
- [x] Bestehende Guardrails in die Release-Checkliste integrieren statt neue Parallelprozesse zu bauen (AC: 1, 2)
  - [x] `react-md3`-Pflichtlauf `npm run quality:gate` als Kernnachweis explizit aufnehmen (`lint`, `test`, `build`, `api:contract:check`).
  - [x] CI-Evidenz aus Kompatibilitaetsmatrix (Node 22/24; Node 20 ausgeschlossen) und Referenzintegration als Pflichtinput fuer den Release-Entscheid dokumentieren.
  - [x] API-Governance-Regeln aus dem Contract-Check (inkl. Migration-Guide-Marker + Changelog-Token-Synchronitaet) als Muss-Kriterium uebernehmen.
- [x] Go/No-Go-Entscheidungsprotokoll fuer Release-Freigaben definieren (AC: 2)
  - [x] Standardisiertes Freigabeprotokoll mit Pflichtfeldern erstellen (Release-Ziel, Evidenzlinks, offene Risiken, Entscheidung, Verantwortliche).
  - [x] Regeln fuer Blocker, Ausnahmefall und Eskalation festlegen (kritischer Bug, API-Regression, Security-Fund).
  - [x] Anschlussfaehigkeit zu Story 4.3 sicherstellen (Go/No-Go fuer Phasenwechsel), ohne Story-4.3-Scope vorwegzunehmen.
- [x] Dokumentationsablage und Pflegeprozess verbindlich machen (AC: 1, 2)
  - [x] Zielstruktur fuer Release-Governance festlegen (Root-README, Paket-README und/oder dedizierte Governance-Datei).
  - [x] Pflegezyklus und Owner pro Gate definieren (wer aktualisiert, wer entscheidet, wann wird geprueft).
  - [x] Sicherstellen, dass Begriffe und Fehlerklassen konsistent zu Story 3.1-3.4 bleiben (`setup-fehler`, `toolchain-drift`, `api-regression`).
- [x] Verifikation und Abnahmevorbereitung dokumentieren (AC: 1, 2)
  - [x] Pruefablauf fuer einen Release-Kandidaten beschreiben (inkl. benoetigter Logs/Reports als Evidence Pack).
  - [x] Mindestens ein negatives Beispiel dokumentieren: fehlendes Gate fuehrt zu eindeutigem No-Go.
  - [x] Story-Artefakte konsistent aktualisieren (`sprint-status.yaml`, Storydatei, Change Log).

## Dev Notes

### Developer Context

- Story 4.1 ist der Governance-Startpunkt von Epic 4: zuerst Kriterien und Checkliste verankern, danach in Story 4.2 automatisieren.
- Bereits vorhandene Qualitaetssignale muessen wiederverwendet werden; kein neuer Shadow-Prozess neben `quality:gate` und bestehenden CI-Workflows.
- Fokus ist Definition und Verbindlichkeit der Gates (Policy + Nachweisstruktur), nicht die technische Pipeline-Erweiterung.

### Technical Requirements

- Story-Ziel laut Epic 4.1: eine einheitliche, messbare Release-Checkliste mit harter Blockade bei fehlenden Kriterien.
- PRD-Governance-Anforderungen fuer diese Story: FR21, FR22, FR23 (und als Anschluss FR24 fuer nachgelagerte Go/No-Go-Prozesse).
- Release-Qualitaetsminimum muss explizit auf kritische Bugs, API-Regressionen und Doku-/Beispielkonsistenz pruefen.
- Bestehender Kernnachweis in `react-md3`: `npm run quality:gate` (`lint`, `test`, `build`, `api:contract:check`).
- API-Contract-Governance ist streng: Migration-Guide-Marker (`Trigger:`, `Alt -> Neu:`, `Betroffene Exports/Pfade:`, `Verifikation:`) und Changelog-Token muessen konsistent sein.

### Architecture Compliance

- Package-API-first bleibt unveraendert: keine neue Runtime-API und kein DB-/Backend-Scope.
- Governance-Aenderungen muessen in bestehende Repo-Muster passen (Root-Doku, Paket-Doku, bestehende CI-Gates).
- Keine stillen Ausnahmen: Blocker-Kriterien muessen als harte No-Go-Regeln dokumentiert werden.

### Library / Framework Requirements

- Relevante Tooling-Baselines im Repo: `react@^19.2.0`, `vite@^7.3.1`, `vitest@^4.0.18`, `typescript~5.9.3`.
- CI-Baselines: `actions/setup-node@v6`, `actions/checkout@v5`, `actions/upload-artifact@v4`.
- Kompatibilitaetspolitik bleibt fuer Release-Gates bindend: Node 22/24 supported, Node 20 bewusst ausgeschlossen.
- Aktueller Stand externer Action-Versionen zeigt `actions/checkout@v6` als verfuegbar; in Story 4.1 ist dies als Entscheidpunkt fuer Governance zu dokumentieren (kein Pflicht-Upgrade in dieser Story).

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints fuer die Umsetzung:
  - `README.md` (Release-Governance auf Produktebene)
  - `react-md3/README.md` (paketnahe, operative Release-Checkliste)
  - Optional dedizierte Governance-Datei fuer Checklist/Decision-Protokoll (nur falls sie den Ablauf klarer macht als README-only)
  - `_bmad-output/implementation-artifacts/4-1-release-checkliste-und-harte-quality-gates-definieren.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Bestehende Workflows (`compatibility-matrix.yml`, `reference-integration.yml`) sind Quellen fuer Nachweise; Story 4.1 muss sie nicht neu implementieren.

### Testing Requirements

- Mindestvalidierung fuer jede inhaltliche Governance-Aenderung im Paketkontext:
  - `cd react-md3 && npm run quality:gate`
- Konsistenzpruefung der Release-Gates:
  - Checkliste muss fuer jeden Gate-Punkt ein messbares Pass/Fail-Kriterium und Evidenzquelle enthalten.
  - Mindestens ein dokumentierter No-Go-Fall muss nachvollziehbar zeigen, dass fehlende Kriterien wirklich blockieren.
- Bei Aenderungen an API-Governance-Texten immer auf Contract-/Changelog-Konsistenz achten (`npm run api:contract:check`).

### Latest Tech Information

- `actions/setup-node@v6` bleibt die aktuelle Baseline fuer Node-Setup in Workflows; `actions/checkout@v6` ist verfuegbar.
- Node 22 (Maintenance-LTS bis 2027) und Node 24 (Active LTS in 2026) sind weiterhin ein sinnvoller Support-Rahmen fuer CI-Matrizen.
- Fuer diese Story gilt: externe Versionssignale als Governance-Kontext erfassen, aber keine Upgrades ohne expliziten Scope in Story 4.2 erzwingen.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, bestehende Story-Artefakte 3.1-3.4, CI-Workflows, API-Contract-Script, Root-/Paket-README.

### Project Structure Notes

- Alignment: Story 4.1 ist ein Governance-/Dokumentationsslice und sollte bestehende Release-Signale in einen verbindlichen Entscheidrahmen ueberfuehren.
- Scope-Grenze: Keine Vollautomatisierung in dieser Story (kommt in 4.2), keine Phasenentscheidungs-Automation (kommt in 4.3).
- Guardrail: Release-Checkliste muss operationalisierbar sein (messbar, evidenzbasiert, blockierend), nicht nur narrativ.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.1: Release-Checkliste und harte Quality Gates definieren]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4: Release-Governance und Lifecycle-Sicherheit]
- [Source: _bmad-output/planning-artifacts/prd.md#Quality Governance & Release Readiness]
- [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional Requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: react-md3/package.json#scripts]
- [Source: react-md3/scripts/check-api-contract.mjs]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: .github/workflows/reference-integration.yml]
- [Source: README.md#Story 3.1 Kompatibilitaetsmatrix und CI-Absicherung]
- [Source: README.md#Story 3.4 Referenzintegration als CI-Nachweis]
- [Source: react-md3/README.md#6) Quality Gates]
- [Source: https://github.com/actions/setup-node/releases]
- [Source: https://github.com/actions/checkout/releases]
- [Source: https://nodejs.org/en/blog/migrations/v22-to-v24]
- [Source: https://endoflife.date/nodejs]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation Run: `cd react-md3 && npm run quality:gate` (PASS)

### Implementation Plan

- Release-Governance als README-first Slice umgesetzt: Root-README verlinkt auf paketnahe Single Source of Truth.
- Operative Checkliste in `react-md3/README.md` mit messbaren Pass/Fail-Gates, Pflicht-Evidenzen und Gate-Ownern ergaenzt.
- Go/No-Go-Protokoll (Pflichtfelder, Blocker, Ausnahmefall, Eskalation) inkl. Story-4.3-Scope-Grenze und negativem No-Go-Beispiel dokumentiert.

### Story Completion Status

- Status set to `done`.
- Completion note: Release-Checkliste, harte Gate-Kriterien und Go/No-Go-Protokoll wurden dokumentiert und gegen bestehende Guardrails verifiziert.

### Completion Notes List

- Story 4.1 als README-Governance-Slice umgesetzt: `react-md3/README.md` Section 6.10 als verbindliche Release-Checkliste etabliert.
- Gate-Tabelle mit Kategorien, messbaren Schwellwerten, Datenquellen, Evidenz und Verantwortlichkeit dokumentiert (kritische Defekte, API/Contract, Doku/Beispiele, Security, Freigabeentscheidung).
- Bestehende Guardrails explizit integriert (`quality:gate`, Kompatibilitaetsmatrix Node 22/24, Referenzintegration, API-Contract-Regeln inkl. Migration-Guide-Marker + Changelog-Token).
- Pruefablauf + Evidence Pack und negatives No-Go-Beispiel dokumentiert; Go/No-Go-Protokoll mit Eskalationsregeln und Story-4.3-Scope-Grenze hinterlegt.
- Validierung durchgefuehrt: `cd react-md3 && npm run quality:gate` erfolgreich.

### File List

- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/4-1-release-checkliste-und-harte-quality-gates-definieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Senior Developer Review (AI)

- Reviewer: Darko
- Date: 2026-02-27
- Outcome: Approve
- Findings: 0 High, 0 Medium, 0 Low
- Git-vs-Story Discrepancies: 0
- Validation:
  - `cd react-md3 && npm run quality:gate` (pass)

## Change Log

- 2026-02-27: Story 4.1 aus Sprint-Backlog uebernommen, umfassenden Umsetzungskontext erstellt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Release-Checkliste und harte Quality-Gates in Root-/Paket-README dokumentiert, Go/No-Go-Protokoll inklusive No-Go-Beispiel ergaenzt und Story auf `review` gesetzt.
- 2026-02-27: Senior Developer Review (YOLO) abgeschlossen, keine Findings festgestellt, Status auf `done` gesetzt.
