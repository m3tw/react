# Story 4.4: PRD-Epics-Traceability-Gate automatisieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Maintainer,
I want einen automatisierten Traceability-Check zwischen PRD und Epics,
so that Requirements- und KPI-Drift vor Release sichtbar und blockierend wird.

## Acceptance Criteria

1. **Given** PRD und Epics als relevante Planungsartefakte
   **When** der CI-Traceability-Check ausgefuehrt wird
   **Then** werden Abweichungen in FR/NFR-Referenzen oder KPI-Verknuepfungen als Fehler markiert.
2. **And** die Pipeline schlaegt fehl, wenn mindestens FR1/FR13/FR14/FR15 oder NFR13/NFR14 nicht konsistent zum PRD sind (FR21, FR23, FR24).

## Tasks / Subtasks

- [x] Traceability-Zielbild und Pflichtquellen verbindlich definieren (AC: 1, 2)
  - [x] PRD als kanonische Quelle fuer FR/NFR/KPI markieren und die relevanten Bereiche eindeutig referenzieren.
  - [x] Epics-Datei als Delivery-/Coverage-Sicht definieren (inkl. FR-Coverage-Map und Story-4.4-ACs).
  - [x] Konsistenzregeln fuer FR1/FR13/FR14/FR15 sowie NFR13/NFR14 explizit als harte Blocker dokumentieren.
- [x] Machine-readable Traceability-Matrix und Validator umsetzen (AC: 1, 2)
  - [x] Neuen Check nach bestehendem Guardrail-Muster in `react-md3/scripts/` implementieren (fail-fast, klare Fehlermeldungen, keine stillen Defaults).
  - [x] Ein maschinenlesbares Mapping fuer PRD->Epics-Verknuepfungen pflegen (FR/NFR/KPI-Links, Pflicht-IDs, erwartete Zuordnungen).
  - [x] Validator so auslegen, dass Drift in Referenzen/Zuordnungen als Fehler endet und lokal sowie in CI reproduzierbar ist.
- [x] Gate-Integration in CI und Release-Evidence vervollstaendigen (AC: 1, 2)
  - [x] `react-md3/package.json` um ein dediziertes Traceability-Skript erweitern und in die bestehende Guardrail-Kette integrieren.
  - [x] `.github/workflows/release-gate.yml` um den Traceability-Nachweis erweitern (Gate-Status + No-Go-Gruende im Evidence Pack).
  - [x] No-Go-Entscheidlogik aus Story 4.2/4.3 unveraendert beibehalten und nur um den neuen Pflichtnachweis ergaenzen.
- [x] Dokumentation entlang der Single Source of Truth aktualisieren (AC: 1, 2)
  - [x] Root-README um den Story-4.4-Verweis auf den operativen Pfad erweitern.
  - [x] `react-md3/README.md` um den Traceability-Gate-Ablauf, Inputs und Failure-Kriterien ergaenzen.
  - [x] Begriffe konsistent halten (`go`/`no-go`, `setup-fehler`, `toolchain-drift`, `api-regression`) und Shadow-Prozesse vermeiden.
- [x] Verifikation und Abnahmevorbereitung durchfuehren (AC: 1, 2)
  - [x] Baseline und Post-Change Guardrail ausfuehren: `cd react-md3 && npm run quality:gate`.
  - [x] Traceability-Check direkt ausfuehren und einen negativen Drift-Fall (Fixture/temporarer Testinput) reproduzierbar als Fail nachweisen.
  - [x] Story-Artefakte und Sprint-Status konsistent aktualisieren.

## Dev Notes

### Developer Context

- Story 4.1 definiert die Release-Checkliste und harte Blocker-Regel, Story 4.2 setzt diese technisch ueber den Release-Gate-Workflow um, Story 4.3 erweitert auf Phasen-Go/No-Go.
- Story 4.4 erweitert denselben Governance-Pfad um einen **zusatzlichen Pflichtnachweis**: PRD-Epics-Traceability fuer FR/NFR/KPI.
- Ziel ist kein neuer Parallelprozess, sondern ein fehlertoleranzarmer Drift-Detektor, der bestehende Freigabeentscheidungen absichert.

### Technical Requirements

- Kanonische Inputs:
  - `_bmad-output/planning-artifacts/prd.md`
  - `_bmad-output/planning-artifacts/epics.md`
- Der Check muss mindestens validieren:
  - PRD-FR- und PRD-NFR-Referenzen sind in der Traceability-Definition vorhanden und auf Epic-/Story-Kontext abgebildet.
  - KPI-Verknuepfungen sind nachvollziehbar und nicht leer.
  - FR1, FR13, FR14, FR15 sowie NFR13, NFR14 werden als harte Konsistenz-Mindestmenge erzwungen.
- Empfohlener Implementierungsstil:
  - Node-ESM-Skript analog zu `check-api-contract.mjs` und `check-m3-coverage.mjs`.
  - Deterministischer Exit-Code (`0` nur bei vollstaendig gruener Traceability), klare Fehlermeldungen pro Drift-Fund.
  - Optionale Report-Ausgabe (maschinenlesbar/markdown) fuer Evidence-Pack-Weiterverarbeitung.
- Keine Broad-Catch-/Silent-Fallback-Logik: fehlende Quellen, unvollstaendige Mappings oder inkonsistente IDs muessen hart fehlschlagen.

### Architecture Compliance

- Scope bleibt Governance/CI/Dokumentation; keine Runtime-API-, Backend- oder Datenbank-Erweiterung.
- Bestehende Repo-Muster sind beizubehalten:
  - Guardrail-Skripte unter `react-md3/scripts/`
  - Orchestrierung in `.github/workflows/`
  - Operative Governance in `react-md3/README.md`
- Fail-fast-Prinzip und auditierbare No-Go-Entscheidungen sind unverhandelbar.

### Library / Framework Requirements

- Bestehende Projekt-Baselines bleiben verbindlich: React 19, TypeScript 5.9, Vite 7, Vitest 4.
- CI-Baselines bleiben konsistent mit vorhandenem Setup:
  - `actions/checkout@v5` (oder gezielt auf v6 mit Runner-Kompatibilitaetspruefung)
  - `actions/setup-node@v6`
  - `actions/upload-artifact@v4`
- Externe Best-Practice fuer Traceability:
  - Pull Requests als End-to-End-Traceability-Anker.
  - Machine-readable Mappings + CI-Blockade bei fehlender Verknuepfung.

### File Structure Requirements

- Erwartete Haupt-Touchpoints:
  - `react-md3/scripts/check-prd-epics-traceability.mjs` (neu)
  - `react-md3/scripts/*traceability*.json` (neu, falls Matrix-Datei genutzt wird)
  - `react-md3/package.json` (neuer Script-Eintrag und Gate-Kette)
  - `.github/workflows/release-gate.yml` (Evidence-Pack + Go/No-Go um Traceability erweitern)
  - `README.md` und `react-md3/README.md` (Governance-Doku)
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/4-4-prd-epics-traceability-gate-automatisieren.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Pflichtvalidierung vor/nach Implementierung:
  - `cd react-md3 && npm run quality:gate`
- Traceability-spezifische Validierung:
  - Direkter Lauf des neuen Checks (z. B. `npm run traceability:check`).
  - Negativfall mit gezielt inkonsistentem Testinput muss reproduzierbar fehlschlagen.
- CI-/Workflow-Validierung:
  - Release-Gate zeigt den Traceability-Status im Evidence-Pack.
  - Bei Traceability-Fail muss die finale Entscheidung `no-go` und der Workflow rot sein.

### Previous Story Intelligence

- Story 4.2 liefert bereits die technische No-Go-Durchsetzung (`decision != go` => Exit 1) und ein maschinenlesbares Evidence Pack.
- Story 4.3 definiert den Phasenentscheid-Prozess, der auf vollstaendige Pflicht-Evidenz angewiesen ist; Story 4.4 muss diesen Input verbessern, nicht umgehen.
- Story 4.1 verlangt weiterhin: fehlende oder rote Pflicht-Evidenz blockiert Stable-Freigaben ohne Ausnahme durch Soft-Defaults.

### Git Intelligence Summary

- Juenge Commit-Historie zeigt eine klare Tendenz zu script-basierten, maschinenpruefbaren Guardrails:
  - `feat: finalize story 2.6 coverage delivery`
  - `fix(ci): add @testing-library/dom for yarn pnp tests`
  - `Fix CI build with symlinks and yarn immutable mode`
- Fuer Story 4.4 bedeutet das: Wiederverwendung bestehender Check-Skript-Patterns ist risikoaermer als ad-hoc Logik im Workflow-YAML.

### Latest Tech Information

- GitHub empfiehlt PR-zentrierte End-to-End-Traceability fuer Auditierbarkeit und schnellere Fehleranalyse.
- Aktuelle Action-Dokumentation zeigt:
  - `actions/checkout` mit aktivem v6-Zweig und Runner-Anforderungen fuer neuere Sicherheitsverbesserungen.
  - `actions/setup-node@v6` mit aktualisiertem Caching-Verhalten.
- Fuer diese Story gilt: bestehende Repo-Baselines beibehalten und nur gezielt upgraden, wenn die Runner-Kompatibilitaet und Governance-Folgen mitgeprueft werden.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 4.1/4.2/4.3, bestehende Workflows, bestehende Guardrail-Skripte, aktuelle Git-Historie und Web-Recherche.

### Story Completion Status

- Status auf `ready-for-dev` gesetzt.
- Completion note: Story-Kontext fuer PRD-Epics-Traceability-Gate inklusive Guardrails, Integrationspfade und Verifikationskriterien erstellt.

### Project Structure Notes

- Das reale Repository ist package-zentriert (`react-md3`) und nicht als voll aktiviertes Monorepo mit `apps/` + `packages/` im Root umgesetzt.
- Traceability-Validierung muss daher robust mit Pfaden ueber Paketgrenzen umgehen (`react-md3` <-> `_bmad-output/planning-artifacts`).
- Gate-Logik soll zentral bleiben: ein klarer Check, ein klarer Status, ein klarer No-Go-Pfad.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.4: PRD-Epics-Traceability-Gate automatisieren]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4: Release-Governance und Lifecycle-Sicherheit]
- [Source: _bmad-output/planning-artifacts/epics.md#FR Coverage Map]
- [Source: _bmad-output/planning-artifacts/prd.md#Functional Requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#Non-Functional Requirements]
- [Source: _bmad-output/planning-artifacts/prd.md#Measurable Outcomes]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/4-1-release-checkliste-und-harte-quality-gates-definieren.md]
- [Source: _bmad-output/implementation-artifacts/4-2-automatisierte-release-gate-pipeline-umsetzen.md]
- [Source: _bmad-output/implementation-artifacts/4-3-go-no-go-entscheidungsprozess-fuer-phasenwechsel-verankern.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: .github/workflows/release-gate.yml]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: .github/workflows/reference-integration.yml]
- [Source: react-md3/package.json#scripts]
- [Source: react-md3/scripts/check-api-contract.mjs]
- [Source: react-md3/scripts/check-m3-coverage.mjs]
- [Source: README.md#Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: README.md#Story 4.3 Go/No-Go-Entscheidungsprozess fuer Phasenwechsel]
- [Source: react-md3/README.md#6.10) Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: react-md3/README.md#6.11) Story 4.3 Go/No-Go-Entscheidungsprozess fuer Phasenwechsel]
- [Source: react-md3/README.md#6.16) Story 2.6 42/42 Komponentenabdeckung]
- [Source: https://github.blog/enterprise-software/governance-and-compliance/demonstrating-end-to-end-traceability-with-pull-requests/]
- [Source: https://github.com/actions/checkout]
- [Source: https://github.com/actions/setup-node]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation: `cd react-md3 && npm run quality:gate` (PASS)
- Traceability positive path: `cd react-md3 && npm run traceability:check` (PASS)
- Traceability negative fixture: `node --input-type=module ... validateTraceability(...)` mit FR14-Drift (FAIL erwartet, Exit-Code 1)

### Completion Notes List

- Neue Traceability-Matrix `react-md3/scripts/prd-epics-traceability-matrix.json` eingefuehrt und FR/NFR/KPI-Verknuepfungen als maschinenlesbare Pflichtregeln fixiert.
- Guardrail-Skript `react-md3/scripts/check-prd-epics-traceability.mjs` inkl. optionaler Report-Ausgabe (`--report`) umgesetzt und fail-fast validiert.
- Quality-Gate und Release-Gate um Traceability-Pfad erweitert (`traceability:check`, `traceability-gate`, Evidence-Pack-Integration inkl. `no-go`-Gruenden).
- Root- und Paket-README entlang der Story-4.4-Governance aktualisiert (Inputs, Ablauf, harte Failure-Kriterien).
- Tests und Verifikation erfolgreich: Traceability-Unit-Tests gruen, `npm run quality:gate` gruen, negativer Drift-Fall reproduzierbar rot.

### File List

- _bmad-output/implementation-artifacts/4-4-prd-epics-traceability-gate-automatisieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- .github/workflows/release-gate.yml
- README.md
- react-md3/README.md
- react-md3/package.json
- react-md3/scripts/check-prd-epics-traceability.mjs
- react-md3/scripts/check-prd-epics-traceability.test.ts
- react-md3/scripts/prd-epics-traceability-matrix.json

### Change Log

- 2026-02-28: Story 4.4 implementiert (Traceability-Validator + Matrix + CI-Gate + README-Updates + Testnachweise).
- 2026-02-28: Senior-Code-Review (YOLO) abgeschlossen; keine Findings, Status auf `done` gesetzt.

## Senior Developer Review (AI)

### Reviewer

GPT-5.3-Codex (adversariales Review)

### Outcome

Approve

### Findings

- High: 0
- Medium: 0
- Low: 0
- Git-vs-Story-Abweichungen: 0

### Validation Evidence

- `cd react-md3 && npm run quality:gate` erfolgreich.
- `cd react-md3 && npm run traceability:report` erfolgreich.
