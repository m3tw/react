# Story 4.3: Go/No-Go-Entscheidungsprozess fuer Phasenwechsel verankern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Product-/Maintainer-Verantwortlicher,
I want einen transparenten Go/No-Go-Workflow fuer Phasenuebergaenge,
so that Scope- und Release-Entscheidungen konsistent und auditierbar bleiben.

## Acceptance Criteria

1. **Given** definierte Schwellwerte fuer Nutzer- und Qualitaetsmetriken
   **When** ein Phasenwechsel ansteht
   **Then** wird die Entscheidung anhand der Kriterien dokumentiert getroffen.
2. **And** Abweichungen oder Risiken sind mit Gegenmassnahmen erfasst (FR24, FR21).

## Tasks / Subtasks

- [x] Phasenuebergaenge und verbindliche Gate-Kriterien definieren (AC: 1, 2)
  - [x] Phasenmodell fuer Release-Governance festlegen (mind. aktueller Abschnitt -> naechster Abschnitt inkl. Trigger-Ereignis).
  - [x] Messbare Schwellwerte fuer Qualitaet und Nutzung definieren (z. B. kritische Defekte, Setup-Erfolg, Evidence-Vollstaendigkeit, offene Risiken).
  - [x] Pro Schwellwert Datenquelle, Owner und Aktualisierungsrhythmus dokumentieren.
- [x] Standardisiertes Go/No-Go-Protokoll fuer Phasenwechsel implementieren (AC: 1, 2)
  - [x] Protokollvorlage mit Pflichtfeldern erstellen (Phase, Scope, Evidenzlinks, Metrik-Snapshot, Risiken, Entscheidung, Sign-off).
  - [x] Rollenmodell fuer Entscheidung festlegen (Release Owner, Product Owner, technischer Reviewer, optional Security Contact).
  - [x] 2-Augen-Freigabe und Unzulaessigkeit von Self-Approval fuer kritische Entscheidungen verankern.
- [x] Abweichungs- und Risikosteuerung operationalisieren (AC: 2)
  - [x] No-Go-Trigger als harte Blocker dokumentieren (fehlende Pflicht-Evidenz, rote Gates, ungeklaerte High/Critical-Risiken).
  - [x] Gegenmassnahmenkatalog inkl. Eskalationspfad und Re-Entry-Kriterien (wann ein erneuter Entscheid erlaubt ist) definieren.
  - [x] Mindestens ein negatives Beispiel (No-Go trotz Teilgruen) und ein positives Beispiel (Go bei vollstaendiger Evidenz) bereitstellen.
- [x] Bestehende Guardrails ohne Shadow-Prozess integrieren (AC: 1, 2)
  - [x] Story-4.1-Checkliste (Section 6.10) und Story-4.2-Evidence-Pack als Pflichtinput fuer Phasenentscheidungen referenzieren.
  - [x] Konsistente Terminologie zu Fehlerklassen (`setup-fehler`, `toolchain-drift`, `api-regression`) und Decision-Status (`go`, `no-go`) sicherstellen.
  - [x] Dokumentationspfad Root-README -> `react-md3/README.md` fuer operative Nutzung aktualisieren.
- [x] Verifikation und Abnahmevorbereitung durchfuehren (AC: 1, 2)
  - [x] `cd react-md3 && npm run quality:gate` als baseline Guardrail laufen lassen.
  - [x] Beispielhafte Phasenentscheidung mit vorhandener oder simuliert unvollstaendiger Evidenz gegen die neue Vorlage pruefen.
  - [x] Story-Artefakte konsistent aktualisieren (`sprint-status.yaml`, Storydatei, Change Log).

## Dev Notes

### Developer Context

- Story 4.1 definiert die operative Release-Checkliste und harte Blocker-Regel fuer Stable-Releases (Section 6.10 in `react-md3/README.md`).
- Story 4.2 automatisiert diese Release-Gates in `.github/workflows/release-gate.yml` und erzeugt ein maschinenlesbares Evidence Pack (`release-evidence/gates.json`, `no-go-reasons.txt`, `evidence-pack.md`).
- Story 4.3 erweitert den Entscheidrahmen auf **Phasenwechsel** (nicht nur einzelne Stable-Releases) und darf die bestehende Gate-Kette nicht duplizieren.
- Zielbild: Ein auditierbarer Entscheidprozess, der qualitative Release-Signale mit Produkt-/Adoptionsschwellwerten zusammenfuehrt.

### Technical Requirements

- FR24 (Go/No-Go fuer Phasenuebergaenge) ist das primare Story-Ziel; FR21 bleibt als Qualitaetsanker verbindlich.
- Entscheidlogik muss explizit und reproduzierbar sein: Kriterien, Datenquelle, Zeitpunkt, Verantwortliche und Entscheidungsergebnis.
- Pflichtinput fuer jede Phasenentscheidung:
  - Aktueller Release-Gate-Status aus Story 4.1/4.2 (inkl. No-Go-Gruende bei Abweichung)
  - Definierte Qualitaets- und Nutzungsmetriken inkl. Schwellenwertvergleich
  - Offene Risiken mit Gegenmassnahmen und Owner
- Harte Blocker duerfen nicht weich interpretiert werden: fehlende oder rote Pflicht-Evidenz => `No-Go`.
- Scope bleibt prozess- und governance-orientiert; kein Eingriff in Public API oder Komponentenimplementierung erforderlich.

### Architecture Compliance

- Keine neue Runtime-API, kein Backend-/Datenbank-Scope; Package-API-first bleibt unveraendert.
- Bestehende Repo-Muster beibehalten:
  - Operative Governance in `react-md3/README.md`
  - Root-README als Einstieg/Verweis
  - CI-Orchestrierung in `.github/workflows/`
- Fail-fast und explizite Fehlerklassifikation beibehalten; keine stillen Fallbacks und keine "best-effort" Freigaben bei unvollstaendiger Evidenz.

### Library / Framework Requirements

- Bestehende CI-Baselines im Repo bleiben Leitplanke:
  - `actions/checkout@v5`
  - `actions/setup-node@v6`
  - `actions/upload-artifact@v4`
- Relevante GitHub-Actions-Patterns fuer manuelle Go/No-Go-Freigaben:
  - Environments mit required reviewers fuer kontrollierte Freigabeschritte
  - Optional `workflow_dispatch`-Inputs fuer strukturierte Entscheidparameter
  - Branch-Protection + required status checks als Vorbedingung fuer Freigabepfade
- Node-Support-Fenster bleibt konsistent zur bestehenden Governance:
  - Node 24 Active LTS
  - Node 22 Maintenance LTS
  - Node 20 ausgeschlossen

### File Structure Requirements

- Erwartete Haupt-Touchpoints fuer diese Story:
  - `README.md` (kurzer Governance-Verweis auf Phasen-Go/No-Go)
  - `react-md3/README.md` (operative Prozessbeschreibung und Protokollvorlage)
  - Optional `.github/workflows/release-gate.yml` oder neuer dedizierter Workflow fuer dokumentierte Phasenentscheidungen (nur wenn durch ACs erforderlich)
  - Optional Artefakt-/Template-Datei fuer Phasen-Protokolle unter einem bereits etablierten Governance-Pfad
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/4-3-go-no-go-entscheidungsprozess-fuer-phasenwechsel-verankern.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Baseline-Validierung vor/nach Governance-Anpassungen:
  - `cd react-md3 && npm run quality:gate`
- Prozessvalidierung:
  - Positivfall: Alle Pflichtkriterien erfuellt -> dokumentiertes `Go` mit vollstaendiger Evidenz.
  - Negativfall: Mindestens ein harter Blocker -> dokumentiertes `No-Go` mit konkreten Gegenmassnahmen.
- Konsistenzvalidierung:
  - Terminologie und Datenquellen bleiben konsistent zu Story 4.1/4.2.
  - Keine Widersprueche zwischen Root-README, `react-md3/README.md` und Workflow-Ausgaben.

### Previous Story Intelligence

- Story 4.2 hat bereits eine harte technische Blockade fuer Stable-Publish implementiert (`decision != go` fuehrt zu Exit 1).
- Das Evidence Pack aus Story 4.2 ist ein direkter Input fuer Story 4.3 und sollte wiederverwendet statt neu erfunden werden.
- Story 4.1 setzt explizit die Scope-Grenze: Release-Freigabe dort, phasenuebergreifender Entscheidprozess in Story 4.3.
- Fehlerklassifikationen aus Story 3.4 und Gate-Reihenfolge aus Story 4.1 muessen unveraendert bleiben.

### Git Intelligence Summary

- Die letzten Umsetzungen in Epic 4 folgen einem stabilen Muster:
  - Governance in README-Dokumentation verankern
  - CI-Guardrails als verpflichtende Nachweise orchestrieren
  - Story- und Sprint-Status-Artefakte konsistent fortschreiben
- Relevante Touchpoint-Historie:
  - `.github/workflows/release-gate.yml` (Story 4.2)
  - `react-md3/README.md` und `README.md` (Story 4.1 + 4.2)
  - `_bmad-output/implementation-artifacts/sprint-status.yaml` (Statusuebergaenge)

### Latest Tech Information

- GitHub Actions Best Practice fuer manuelle Freigaben:
  - Deployment Environments mit **required reviewers** und optionalem Verbot von Self-Approval fuer kritische Freigaben.
  - `workflow_dispatch`-Inputs fuer strukturierte, nachvollziehbare Entscheidparameter.
  - Kombination mit Branch-Protection und required checks fuer auditable Governance.
- Node.js Lifecycle-Stand:
  - Node 24 in Active LTS
  - Node 22 in Maintenance LTS
  - CI-Supportfenster auf aktive + Maintenance-LTS-Versionen ausrichten reduziert Sicherheits- und Kompatibilitaetsrisiken.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 4.1, Story 4.2, aktuelle Workflow-Dateien, Root-/Paket-README, Git-Historie und aktuelle Web-Recherche.

### Story Completion Status

- Status auf `done` gesetzt.
- Completion note: Phasen-Go/No-Go-Prozess in Root-/Paket-README verankert und mit `cd react-md3 && npm run quality:gate` verifiziert.

### Project Structure Notes

- Das Repository arbeitet aktuell package-zentriert im Pfad `react-md3`; Governance- und Workflow-Aenderungen muessen auf diese reale Struktur ausgerichtet bleiben.
- Dokumentationsaenderungen fuer Story 4.3 sollen bestehende Single-Source-of-Truth-Pfade ergaenzen, nicht ersetzen.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 4.3: Go/No-Go-Entscheidungsprozess fuer Phasenwechsel verankern]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 4: Release-Governance und Lifecycle-Sicherheit]
- [Source: _bmad-output/planning-artifacts/prd.md#Quality Governance & Release Readiness]
- [Source: _bmad-output/planning-artifacts/prd.md#Success Criteria]
- [Source: _bmad-output/planning-artifacts/architecture.md#Infrastructure & Deployment]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/4-1-release-checkliste-und-harte-quality-gates-definieren.md]
- [Source: _bmad-output/implementation-artifacts/4-2-automatisierte-release-gate-pipeline-umsetzen.md]
- [Source: .github/workflows/release-gate.yml]
- [Source: .github/workflows/compatibility-matrix.yml]
- [Source: .github/workflows/reference-integration.yml]
- [Source: README.md#Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: react-md3/README.md#6.10) Story 4.1 Release-Checkliste und harte Quality Gates]
- [Source: https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/control-deployments]
- [Source: https://docs.github.com/en/actions/concepts/workflows-and-actions/deployment-environments]
- [Source: https://nodejs.org/en/about/previous-releases]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Baseline Validation: `cd react-md3 && npm run quality:gate` (pre-change, pass)
- Post-Change Validation: `cd react-md3 && npm run quality:gate` (post-change, pass)

### Completion Notes List

- Phasen-Go/No-Go-Prozess in `react-md3/README.md` als operative Section 6.11 verankert (Phasenmodell, Gate-Kriterien, Rollenmodell, Protokollvorlage, No-Go-Trigger, Re-Entry).
- Root-README um Story-4.3-Governance-Verweis auf den operativen Pfad erweitert.
- Verifikation mit `npm run quality:gate` vor und nach der Doku-Anpassung erfolgreich durchgefuehrt.

### File List

- _bmad-output/implementation-artifacts/4-3-go-no-go-entscheidungsprozess-fuer-phasenwechsel-verankern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- README.md
- react-md3/README.md

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

### Change Log

- 2026-02-27: Story 4.3 erzeugt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Story 4.3 umgesetzt; Phasen-Go/No-Go-Prozess in README-Dokumentation verankert, quality:gate vor/nach Aenderung erfolgreich, Status auf `review` gesetzt.
- 2026-02-28: Senior-Code-Review (YOLO) abgeschlossen; keine Findings, Status auf `done` gesetzt.
