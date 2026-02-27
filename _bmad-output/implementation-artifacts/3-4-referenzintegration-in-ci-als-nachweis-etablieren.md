# Story 3.4: Referenzintegration in CI als Nachweis etablieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Integrations-Entwickler,  
I want ein CI-validiertes Referenzprojekt mit End-to-End-Integrationslauf,  
so that ich Integrationsstabilitaet vor produktiver Uebernahme pruefen kann.

## Acceptance Criteria

1. **Given** ein gepflegtes Referenzprojekt fuer die Library-Integration  
   **When** die CI-Pipeline mit Install, Build und Test laeuft  
   **Then** wird die Integrationsfaehigkeit fuer den definierten Support-Rahmen bestaetigt.
2. **And** Fehler schlagen mit klarer Ursache und Zuordnung fehl (FR18, FR19, FR20).

## Tasks / Subtasks

- [x] Referenzintegration als reproduzierbares Integrations-Target aufsetzen (AC: 1, 2)
  - [x] Zielstruktur fuer das Referenzprojekt festlegen (innerhalb von `react-md3` oder als dedizierter Root-Unterordner) und dokumentieren.
  - [x] Referenzprojekt ausschliesslich ueber den Public Entry integrieren (kein Deep-Import auf `src/components/*`).
  - [x] Mindestens einen produktiven Integrationspfad (Install -> Build -> Test) als Smoke-Nachweis im Referenzprojekt abbilden.
- [x] CI-Nachweisworkflow fuer Referenzintegration implementieren (AC: 1, 2)
  - [x] Neuen Workflow oder dedizierten Job an bestehende CI anbinden (`pull_request`, `push`, optional `workflow_dispatch`) mit sinnvollen Path-Filtern.
  - [x] Supportfenster aus Story 3.1 uebernehmen (Node 22/24 supported, Node 20 explizit ausgeschlossen) und konsistent dokumentieren.
  - [x] Lauf muss Install, Build und Test im Referenzprojekt reproduzierbar ausfuehren und bei Fehlern hart fehlschlagen.
- [x] Fehlerzuordnung und Diagnose-Signal schaerfen (AC: 2)
  - [x] Fehlertypen aus Story 3.1/3.2 wiederverwenden: `setup-fehler`, `toolchain-drift`, `api-regression`.
  - [x] Schrittbezeichnungen, Exit-Messages und Step Summary so aufbauen, dass Verantwortlichkeit sofort sichtbar ist.
  - [x] Fuer Debugbarkeit CI-Artefakte (z. B. Build-/Testlogs) mit eindeutigen Artefaktnamen bereitstellen.
- [x] Dokumentation fuer Team-Reproduktion erweitern (AC: 1, 2)
  - [x] Root-README und `react-md3/README.md` um Referenzintegrations-Runbook erweitern (lokale Reproduktion + CI-Interpretation).
  - [x] Integrationsrezept aus Story 3.2 mit dem neuen Referenzlauf verknuepfen (kein paralleler Shadow-Prozess).
  - [x] Guardrails zu Public API, Quality Gates und Migrationspfad in einem konsistenten Ablauf verlinken.
- [x] Verifikation und Abschlussnachweise ausfuehren (AC: 1, 2)
  - [x] Pflichtvalidierung `cd react-md3 && npm run quality:gate` ohne Regression durchfuehren.
  - [x] Referenzintegrationslauf lokal reproduzieren und die Fehlersignale fuer mindestens ein bewusst provoziertes Fehlerbild pruefen.
  - [x] Story-Artefakte (`sprint-status.yaml`, Storydatei, README-Abschnitte, Workflow-Datei) konsistent aktualisieren.

## Dev Notes

### Developer Context

- Story 3.4 schliesst Epic 3 mit einem operativen Nachweis: nicht nur Matrix-Kompatibilitaet und Integrationsrezepte, sondern ein durchgaengiger CI-Referenzlauf als belastbare Integrationsbestaetigung.
- Story 3.1 hat Supportfenster und Matrixregeln bereits verbindlich gemacht; Story 3.4 darf diese Policy nicht neu definieren, sondern muss sie fuer das Referenzprojekt anwenden.
- Story 3.2 hat ein einheitliches Rezeptformat etabliert; Story 3.4 muss den CI-Referenzlauf in dasselbe Format integrieren.
- Story 3.3 hat Governance-Synchronitaet zwischen API-Contract und Changelog geschaerft; Referenz-CI muss API-Regressionen klar als eigene Fehlerklasse sichtbar machen.

### Technical Requirements

- Supportpolicy bleibt unveraendert: Node 22.x und 24.x sind supported; Node 20.x ist explizit ausgeschlossen.
- Referenzintegration darf nur die Public API nutzen; keine Deep-Imports und keine Umgehung von Barrel-Exports.
- CI-Nachweis muss mindestens Install, Build und Test ausfuehren; Fehler muessen klar einer Kategorie zuordenbar sein.
- Bestehender Guardrail `quality:gate` bleibt Pflicht, damit Lint/Test/Build/API-Contract-Check weiterhin zusammen validiert werden.
- Artefakt-/Log-Handling muss reproduzierbar sein (eindeutige Namen je Lauf/Matrix-Zelle, fuer schnelle Diagnose bei CI-Fehlern).

### Architecture Compliance

- Package-API-first bleibt unveraendert: keine neue Runtime-API, kein Datenbank- oder Backend-Scope.
- CI-Umsetzung orientiert sich an den existierenden Workflow-Mustern unter `.github/workflows/` (Matrix, klare Step-Namen, hartes Fail-Verhalten).
- Keine Shadow-Gates einfuehren: Referenzintegration erweitert die bestehende Qualitaetskette und ersetzt sie nicht.
- Struktur- und Naming-Konventionen aus der Architektur gelten auch fuer neue CI- und Integrationsdateien.

### Library / Framework Requirements

- Toolchain-Baselines aus dem Repository: `react@^19.2.0`, `react-dom@^19.2.0`, `vite@^7.3.1`, `vitest@^4.0.18`, `typescript~5.9.3`.
- Bestehende CI verwendet `actions/setup-node@v6` und `oven-sh/setup-bun@v2`; diese Baseline ist fuer Story 3.4 der Ausgangspunkt.
- Aktuelle GitHub-Actions-Hinweise nennen `actions/checkout@v6` als neueste Hauptlinie; bei einem Upgrade muessen Runner-Kompatibilitaet und Repo-Konsistenz explizit geprueft werden.
- Fuer CI-Artefakte gelten `actions/upload-artifact@v4` und `actions/download-artifact@v4` als empfohlene Basis mit eindeutigen Artefaktnamen.

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `.github/workflows/compatibility-matrix.yml` (Erweiterung) oder neue Workflow-Datei fuer Referenzintegration
  - `README.md` (Root-Integrationsnachweis und Reproduktionsschritte)
  - `react-md3/README.md` (Paketnahe Referenzintegrationsanleitung)
  - neuer Referenzprojektpfad (z. B. unter `react-md3/`), inklusive minimalem Build-/Test-Setup
  - `_bmad-output/implementation-artifacts/3-4-referenzintegration-in-ci-als-nachweis-etablieren.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Neue Struktur nur einfuehren, wenn sie mit der vorhandenen Repo-Organisation konsistent ist und keine Doppelpfade erzeugt.

### Testing Requirements

- Mindestvalidierung vor Story-Abschluss:
  - `cd react-md3 && npm run quality:gate`
- Fuer die neue Referenzintegration zusaetzlich:
  - CI-Lauf mit Install -> Build -> Test im Referenzprojekt
  - klare Klassifikation von Fehlern (Setup / Toolchain / API)
  - reproduzierbare lokale Ausfuehrung des Referenzpfads fuer Debugging ohne GitHub Runner
- Wenn Workflow-Dateien angepasst werden, mindestens einen lokalen Dry-Run-Check der Commands dokumentieren.

### Previous Story Intelligence

- Story 3.3 Learning: Governance-Artefakte muessen synchron bleiben; API-Regressionen duerfen nicht als unspezifischer CI-Fehler enden.
- Story 3.3 Learning: `quality:gate` ist der verbindliche Nachweis und muss in allen Integrationsablaeufen erhalten bleiben.
- Story 3.2 Learning: Rezeptformat und Fehlerklassifikation muessen konsistent bleiben; keine abweichenden Teamprozesse einfuehren.
- Story 3.1 Learning: Supportfenster (Node 22/24) und Matrixpolitik sind bindend; ausgeschlossenes Node-20-Fenster nicht implizit reaktivieren.

### Git Intelligence Summary

- `92b3721 feat: complete story 3.3 migration path` zeigt das Muster "Governance + Dokumentation + Sprint-Status synchron aktualisieren".
- `7e98f0a docs: complete story 3.2 integration review` bestaetigt, dass Integrationsleitfaeden im Root-README und Paket-README parallel gepflegt werden.
- `58c728b feat: complete story 3.1 compatibility matrix` hat die technische CI-Basis geliefert; Story 3.4 sollte darauf aufbauen statt neu zu erfinden.
- Damit ist fuer Story 3.4 ein inkrementeller CI-Ausbau mit klaren Nachweissignalen und minimalem Scope-Risiko der konsistente Pfad.

### Latest Tech Information

- `actions/setup-node@v6` ist weiterhin die aktuelle Node-Setup-Basis fuer moderne Runner und Cache-Strategien.
- `actions/checkout@v6` ist als neueste Hauptversion verfuegbar; aktuelle Repo-Basis (`@v5`) kann beibehalten oder mit geplanter Runner-Pruefung aktualisiert werden.
- Fuer Artefaktfluss gelten `upload-artifact@v4` / `download-artifact@v4` als bevorzugte Versionen; eindeutige Artefaktnamen pro Matrix-Zelle vermeiden Konflikte.
- Matrix-Reliability-Best-Practices bestaetigen `fail-fast: false`, eindeutige Job-/Artefaktnamen und nachgelagerte Sammeljobs fuer Diagnosen.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 3.1/3.2/3.3, aktuelle CI-Workflow-Datei, Root-/Paket-README, Package-Skripte.

### Project Structure Notes

- Alignment: Story 3.4 ist ein Integrations-/CI-Story-Slice und sollte primaer Workflow-, Doku- und Referenzprojektflaechen anpassen.
- Guardrail: Keine Vermischung mit Epic-4-Release-Governance; Story 3.4 liefert Integrationsnachweis, nicht den finalen Release-Go/No-Go-Prozess.
- Erwartete Deliverables muessen fuer Dev-Agent klar trennbar sein: Referenzprojekt, CI-Lauf, Fehlersignal, Doku-Reproduktion.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.4: Referenzintegration in CI als Nachweis etablieren]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3: Integrationsfaehigkeit und Team-Workflow-Kompatibilitaet]
- [Source: _bmad-output/planning-artifacts/prd.md#Integration Requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#Risk Mitigations]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/3-3-migrationspfad-fuer-api-aenderungen-operationalisieren.md]
- [Source: _bmad-output/implementation-artifacts/3-2-integrationsrezepte-fuer-gaengige-team-setups-bereitstellen.md]
- [Source: _bmad-output/implementation-artifacts/3-1-kompatibilitaetsmatrix-definieren-und-in-ci-absichern.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: README.md]
- [Source: react-md3/README.md]
- [Source: react-md3/package.json]
- [Source: https://github.com/actions/setup-node]
- [Source: https://github.com/actions/checkout]
- [Source: https://github.com/marketplace/actions/setup-bun]
- [Source: https://docs.github.com/en/actions/tutorials/store-and-share-data]
- [Source: https://github.blog/news-insights/product-news/get-started-with-v4-of-github-actions-artifacts/]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Reference CI Workflow: `.github/workflows/reference-integration.yml`
- Reference Smoke Validation: `cd react-md3/reference-integration && npm ci && npm run ci:smoke`
- Failure Signal Probe: `cd react-md3/reference-integration && REFERENCE_FAIL_MODE=api-regression npm run ci:smoke`
- Quality Gate Validation: `cd react-md3 && npm run quality:gate`

### Story Completion Status

- Status set to `done`.
- Completion note: Referenzintegration inkl. CI-Nachweisworkflow, Fehlersignale und Doku-Runbook ist umgesetzt und validiert.

### Completion Notes List

- Referenzprojekt unter `react-md3/reference-integration` erstellt und Public-API-only Smoke-Integration (`install -> build -> test`) ueber `react-md3` umgesetzt.
- Neuer Workflow `.github/workflows/reference-integration.yml` implementiert (Node 22/24, harte Install/Build/Test-Schritte, Path-Filter, Artefakt-Upload, Step Summary).
- Fehlerklassifikation `setup-fehler`, `toolchain-drift`, `api-regression` in Workflow-Step-Namen, CI-Summary und lokalem Smoke-Runner verankert.
- Root-README und `react-md3/README.md` um Story-3.4-Runbook, lokale Reproduktion, Failure-Probe und Guardrail-Kette erweitert.
- Validierung erfolgreich: `cd react-md3/reference-integration && npm ci && npm run ci:smoke`, `REFERENCE_FAIL_MODE=api-regression npm run ci:smoke` (erwartet fail), `cd react-md3 && npm run quality:gate`.

### File List

- _bmad-output/implementation-artifacts/3-4-referenzintegration-in-ci-als-nachweis-etablieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- .github/workflows/reference-integration.yml
- README.md
- react-md3/README.md
- react-md3/reference-integration/index.html
- react-md3/reference-integration/package-lock.json
- react-md3/reference-integration/package.json
- react-md3/reference-integration/scripts/run-reference-smoke.mjs
- react-md3/reference-integration/src/App.jsx
- react-md3/reference-integration/src/main.jsx
- react-md3/reference-integration/tests/public-api-smoke.check.jsx
- react-md3/reference-integration/tests/setup.js
- react-md3/reference-integration/vite.config.js
- react-md3/reference-integration/vitest.config.js

## Senior Developer Review (AI)

- Reviewer: Darko
- Date: 2026-02-27
- Outcome: Approve
- Findings: 0 High, 0 Medium, 0 Low
- Git-vs-Story Discrepancies: 0
- Validation:
  - `cd react-md3 && npm run quality:gate` (pass)
  - `cd react-md3/reference-integration && npm ci && npm run ci:smoke` (pass)
  - `cd react-md3/reference-integration && REFERENCE_FAIL_MODE=api-regression npm run ci:smoke` (expected fail)

## Change Log

- 2026-02-27: Story 3.4 aus Sprint-Backlog uebernommen, umfassenden Umsetzungskontext erstellt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Story 3.4 umgesetzt: Referenzintegration + CI-Nachweisworkflow + Runbook erweitert, Validierungen erfolgreich, Status auf `review` gesetzt.
- 2026-02-27: Senior Code Review (YOLO) abgeschlossen, keine Findings festgestellt, Status auf `done` gesetzt.
