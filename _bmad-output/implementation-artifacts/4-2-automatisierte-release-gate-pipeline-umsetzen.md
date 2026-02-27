# Story 4.2: Automatisierte Release-Gate-Pipeline umsetzen

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Maintainer,  
I want automatisierte Pruefungen fuer Tests, API-Konsistenz und Beispiel-Lauffaehigkeit,  
so that ich Freigabeentscheidungen datenbasiert und reproduzierbar treffen kann.

## Acceptance Criteria

1. **Given** die definierte CI/CD-Release-Pipeline  
   **When** ein Release-Branch oder Tag geprueft wird  
   **Then** laufen alle Gates automatisiert mit eindeutigem Pass/Fail-Ergebnis.
2. **And** kritische Defekte oder Regressionen verhindern einen Stable-Publish (FR22, FR23).

## Tasks / Subtasks

- [x] Release-Gate-Workflow fuer Stable-Freigaben aufsetzen (AC: 1, 2)
  - [x] Neuen Workflow unter `.github/workflows/` fuer `release/*`-Branches, Tags und `workflow_dispatch` anlegen.
  - [x] Trigger und Permissions so festlegen, dass nur Read-Zugriffe benoetigt werden und Publish-Schritte erst nach gruenen Gates moeglich sind.
  - [x] Harte Blockade bei fehlender Evidenz oder rotem Gate technisch erzwingen.
- [x] Bestehende Guardrails in eine automatisierte Gate-Kette orchestrieren (AC: 1, 2)
  - [x] `cd react-md3 && npm run quality:gate` als Pflichtlauf integrieren.
  - [x] Kompatibilitaetsnachweise fuer Node 22/24 als verpflichtende Inputs der Freigabeentscheidung einbinden.
  - [x] Referenzintegrationsnachweise (inkl. Fehlerklassen `setup-fehler`, `toolchain-drift`, `api-regression`) als Pflichtgate auswerten.
- [x] API-Contract-Governance als Release-Blocker absichern (AC: 1, 2)
  - [x] Sicherstellen, dass `api:contract:check` im Gate-Lauf enthalten bleibt und bei Abweichungen hart fehlschlaegt.
  - [x] Bei API-Aenderungen Contract-/Changelog-Synchronitaet (`migrationGuide`-Marker + `api-contract-hash`) als No-Go-Kriterium behandeln.
- [x] Evidence Pack und Go/No-Go-Ausgabe automatisieren (AC: 1, 2)
  - [x] Pro Gate maschinenlesbare Summary (Pass/Fail + Link auf Logs/Artefakte) erzeugen.
  - [x] Freigabefaehige Evidence-Pack-Zusammenfassung im Workflow-Run publizieren.
  - [x] Fehlende Pflicht-Evidenz explizit als `No-Go` kennzeichnen.
- [x] Dokumentation auf den automatisierten Pipeline-Pfad ausrichten (AC: 1, 2)
  - [x] Root-README und `react-md3/README.md` nur dort aktualisieren, wo die neue Automation den bestehenden Governance-Pfad konkretisiert.
  - [x] Sicherstellen, dass Story 4.1 als Single Source of Truth erhalten bleibt und Story 4.2 nur die technische Durchsetzung ergaenzt.

## Dev Notes

### Developer Context

- Story 4.1 hat die inhaltliche Release-Governance bereits verbindlich festgelegt; Story 4.2 setzt diese Gates technisch um.
- Kein Shadow-Prozess: die Pipeline muss bestehende Guardrails orchestrieren statt neue parallele Qualitaetsdefinitionen einzufuehren.
- Fokus von Story 4.2: Automation und reproduzierbare Pass/Fail-Signale fuer Release-Entscheidungen.

### Technical Requirements

- Release-Gates muessen die in `react-md3/README.md` Section 6.10 definierte Reihenfolge respektieren:
  1. Kritische Defekte
  2. API-/Contract-Konsistenz
  3. Beispiel-/Doku-Konsistenz
  4. Security
  5. Freigabeentscheidung
- Pflicht-Gates fuer den automatisierten Nachweis:
  - `cd react-md3 && npm run quality:gate`
  - Kompatibilitaetsmatrix (Node 22/24)
  - Referenzintegration (Node 22/24)
  - API-Contract/Changelog-Synchronitaet (via `api:contract:check`)
- Stable-Publish darf nur bei 100% gruener Evidenz erfolgen; fehlende oder rote Evidenz muss hart blockieren.

### Architecture Compliance

- Keine Erweiterung auf Runtime-API, Backend oder Datenbank; Scope bleibt CI/CD, Governance und Dokumentation.
- Bestehende Repo-Struktur beibehalten: Workflows unter `.github/workflows/`, Paketvalidierung unter `react-md3/`.
- Fail-fast und explizite Fehlerklassifikation sind verpflichtend; keine stillen Fallbacks.

### Library / Framework Requirements

- Projekt-Baselines in `react-md3`: React 19, TypeScript 5.9, Vite 7, Vitest 4.
- CI-Action-Baselines im Repo: `actions/setup-node@v6`, `actions/checkout@v5`, `actions/upload-artifact@v4`.
- Externer Stand (Web-Research): `actions/checkout@v6` und `actions/setup-node@v6` verfuegbar; bei Upgrades Runner-Anforderungen beachten (v2.327.1+/v2.329.0+ je nach Feature).
- Node-Release-Stand laut Node.js-Seite: Node 24 Active LTS, Node 22 Maintenance LTS; Supportfenster 22/24 bleibt fuer diese Story konsistent.

### File Structure Requirements

- Erwartete Haupt-Touchpoints fuer die Implementierung:
  - `.github/workflows/` (neuer oder erweiterter Release-Gate-Workflow)
  - `README.md` (kurzer Projektverweis auf den automatisierten Freigabepfad)
  - `react-md3/README.md` (operative Governance bleibt zentral in Section 6.10)
  - Optional: vorhandene Workflows (`compatibility-matrix.yml`, `reference-integration.yml`) per `workflow_call`/Orchestrierung einbinden statt Logik zu duplizieren
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/4-2-automatisierte-release-gate-pipeline-umsetzen.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Lokaler Maintainer-Guardrail vor/nach Workflow-Aenderungen:
  - `cd react-md3 && npm run quality:gate`
- Referenzintegrationsnachweis lokal verifizierbar halten:
  - `cd react-md3/reference-integration && npm ci && npm run ci:smoke`
- Workflow-Verifikation fuer Story 4.2:
  - Erfolgsfall: alle Gates gruen, Evidence Pack vollstaendig, Go-Signal eindeutig.
  - Negativfall: mindestens ein rotes/fehlendes Gate fuehrt zu eindeutigem No-Go und blockiert Stable-Publish.

### Previous Story Intelligence

- Story 4.1 definiert Section 6.10 als verbindliche Single Source of Truth fuer Release-Gates.
- Harte Regel aus 4.1 bleibt unveraendert: fehlende Evidenz oder rotes Gate => No-Go.
- Fehlerklassifikationen aus Story 3.4 (`setup-fehler`, `toolchain-drift`, `api-regression`) muessen in der automatisierten Auswertung erhalten bleiben.
- Scope-Grenze beachten: 4.2 automatisiert Release-Freigaben; phasenuebergreifende Go/No-Go-Steuerung ist Story 4.3.

### Git Intelligence Summary

- Aktuelle Commit-Muster zeigen konsistente Delivery ueber:
  - CI-Workflows in `.github/workflows/`
  - README-Dokumentation auf Root- und Paketebene
  - Story-Artefakte plus Statusuebergaenge in `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Relevante Vorarbeiten:
  - Story 3.1: Kompatibilitaetsmatrix
  - Story 3.4: Referenzintegration
  - Story 4.1: Release-Governance

### Latest Tech Information

- `actions/setup-node` dokumentiert in v6 u. a. geaendertes npm-Caching-Verhalten und Entfernen von `always-auth`.
- `actions/checkout` dokumentiert in v6 Credential-Haertung und Runner-Anforderung fuer Docker-Action-Szenarien.
- Node.js Release-Seite fuehrt Node 24 als Active LTS und Node 22 als Maintenance LTS; passt zum Projekt-Supportfenster.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 4.1, bestehende CI-Workflows, API-Contract-Skript, Root-/Paket-README, Web-Research zu Actions/Node.

### Project Structure Notes

- Das reale Projekt arbeitet aktuell package-zentriert im Verzeichnis `react-md3` (kein aktiver Workspace-Split in `apps/` und `packages/` im Repo-Root).
- Release-Gate-Automation muss deshalb direkt auf bestehende Pfade (`react-md3`, `react-md3/reference-integration`, `.github/workflows`) ausgerichtet sein.
- Story 4.2 soll vorhandene Gate-Bausteine verbinden, nicht dieselben Pruefungen mehrfach implementieren.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.2: Automatisierte Release-Gate-Pipeline umsetzen]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4: Release-Governance und Lifecycle-Sicherheit]
- [Source: _bmad-output/planning-artifacts/prd.md#Quality Governance & Release Readiness]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/implementation-artifacts/4-1-release-checkliste-und-harte-quality-gates-definieren.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: README.md#Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: react-md3/README.md#6.10) Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: .github/workflows/reference-integration.yml]
- [Source: react-md3/package.json#scripts]
- [Source: react-md3/scripts/check-api-contract.mjs]
- [Source: https://github.com/actions/setup-node]
- [Source: https://github.com/actions/checkout]
- [Source: https://nodejs.org/en/about/previous-releases]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Baseline Validation: `cd react-md3 && npm run quality:gate` (PASS)
- Reference Validation: `cd react-md3/reference-integration && npm ci && npm run ci:smoke` (PASS)
- Workflow YAML Validation: `ruby -e 'require "yaml"; Dir[".github/workflows/*.{yml,yaml}"].sort.each { |f| YAML.load_file(f) }'` (PASS)

### Completion Notes List

- Neuer Workflow `.github/workflows/release-gate.yml` eingefuehrt (Trigger: `release/*`, Tags `v*`, `workflow_dispatch`) und auf `contents: read` begrenzt.
- Bestehende Guardrails als Pflichtkette orchestriert: `quality:gate`, Kompatibilitaetsmatrix (Node 22/24), Referenzintegration (Node 22/24).
- Evidence-Pack-Automation umgesetzt: `release-evidence/gates.json`, `evidence-pack.md`, Artefakt-Upload und explizite No-Go-Gruende bei fehlender/roter Evidenz.
- Harte Blockade technisch erzwungen: `Enforce hard release gate` beendet den Run mit Fehler bei `decision != go`; Publish-Pfad wird erst nach gruener Entscheidung freigegeben.
- Reusable-Orchestrierung vorbereitet: bestehende Workflows `compatibility-matrix.yml` und `reference-integration.yml` um `workflow_call` erweitert.
- Doku minimal konkretisiert (`README.md`, `react-md3/README.md`), ohne die Single Source of Truth in Story 4.1/Section 6.10 zu verschieben.

### File List

- .github/workflows/release-gate.yml
- .github/workflows/compatibility-matrix.yml
- .github/workflows/reference-integration.yml
- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/4-2-automatisierte-release-gate-pipeline-umsetzen.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

### Change Log

- 2026-02-27: Story 4.2 erzeugt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Story 4.2 implementiert; Release-Gate-Pipeline, Evidence-Pack-Automation und harte No-Go-Blockade fuer Stable-Freigaben umgesetzt.
- 2026-02-27: Senior-Code-Review abgeschlossen; keine Findings, Status auf `done` gesetzt.

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

- YAML-Validierung der Workflows erfolgreich.
- `cd react-md3 && npm run quality:gate` erfolgreich.
- `cd react-md3/reference-integration && npm ci && npm run ci:smoke` erfolgreich.
