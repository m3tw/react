# Story 5.3: KPI-Tracking fuer Adoption und Time-to-Value etablieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Product-Verantwortlicher,
I want konsistente Messdefinitionen und Tracking-Pfade fuer Kernmetriken,
so that ich Produktfortschritt und Nutzungsqualitaet belastbar steuern kann.

## Acceptance Criteria

1. **Given** definierte KPI-Definitionen fuer aktive Nutzung, Time-to-Value und Setup-Erfolg
   **When** Metriken periodisch ausgewertet werden
   **Then** sind Werte trendfaehig und ueber Releases vergleichbar.
2. **And** Zielabweichungen koennen auf konkrete Produktmassnahmen zurueckgefuehrt werden (FR28, FR29, FR30, FR31).

## Tasks / Subtasks

- [x] KPI-Katalog fuer Epic-5-Adoption verbindlich definieren (AC: 1, 2)
  - [x] Einheitliche Metrikdefinitionen dokumentieren (Name, Formel, Zaehler/Nenner, Messfenster, Aggregation, Owner, Cadence).
  - [x] Kernmetriken mindestens fuer FR28-FR31 abdecken: aktive Nutzung, Time-to-Value, Setup-Erfolg, Weiterverwendung.
  - [x] Vergleichbarkeit ueber Releases absichern (stabile Definitionen, UTC-Zeitbezug, Baseline + Zielwerte pro Metrik).
- [x] Tracking-Pfade und Datenquellen ohne neuen Runtime-Scope verankern (AC: 1)
  - [x] Datenquellen-Mapping auf bestehende Repo-Artefakte festlegen (GitHub Repo- und Traffic-Signale, Issue-/Label-Daten, Guardrail-Ergebnisse).
  - [x] Erhebungsprozess fuer periodische Auswertung dokumentieren (z. B. monatlicher Snapshot + Release-bezogene Auswertung).
  - [x] Datenqualitaetsregeln definieren (fehlende Daten markieren, keine stillen Defaults, Messluecken explizit kennzeichnen).
- [x] KPI-Auswertung mit konkreten Produktmassnahmen verknuepfen (AC: 2)
  - [x] Trigger-/Schwellwerte fuer Abweichungen pro KPI festlegen.
  - [x] Entscheidungspfad dokumentieren: Beobachtung -> Analyse -> priorisierte Massnahme -> Rueckmessung.
  - [x] Anschluss an Story 5.4 vorbereiten (Feedback-Loop fuer Priorisierung/Roadmap).
- [x] Validierung und Nachweis fuer Reproduzierbarkeit ausfuehren (AC: 1, 2)
  - [x] Mindestens eine Beispielauswertung mit dem definierten KPI-Schema durchspielen und dokumentieren.
  - [x] Konsistenz mit bestehenden Support-/Recovery-Konventionen pruefen (`setup-fehler`, `toolchain-drift`, `api-regression`; `status:*`).
  - [x] Repo-Guardrail als Basisnachweis laufen lassen: `cd react-md3 && npm run quality:gate`.

## Dev Notes

### Developer Context

- Story 5.1 hat den strukturierten Intake und kanonische Problemklassen/Labels eingefuehrt; Story 5.2 hat Recovery-Playbooks und Verifikationsablauf stabilisiert.
- Story 5.3 operationalisiert nun FR28-FR31 aus Epic 5 durch ein belastbares KPI-Set und periodische Auswertungslogik.
- Scope bleibt dokumentations- und prozessorientiert; Ziel ist eine belastbare Entscheidungsbasis fuer Product-/Maintainer-Steuerung, nicht neue Runtime-Telemetrie.

### Technical Requirements

- Primaere FR-Abdeckung: FR28, FR29, FR30, FR31.
- Pro KPI muessen mindestens folgende Felder definiert sein:
  1. KPI-Name + Business-Frage
  2. Exakte Berechnungsformel (Zaehler/Nenner)
  3. Datenquelle(n) inkl. Zugriffsvoraussetzungen
  4. Messfenster/Cadence (z. B. monatlich, releasebezogen)
  5. Baseline, Zielwert und Eskalationsschwelle
  6. Verantwortliche Rolle fuer Auswertung und Folgemassnahmen
- Time-to-Value- und Aktivierungsmetriken muessen stabil versioniert werden; Definitionsaenderungen nur explizit und mit Vergleichshinweis.
- KPI-Auswertung muss auf konkrete Produktmassnahmen rueckfuehrbar sein (keine reine Reporting-Ablage ohne Entscheidungslogik).

### Architecture Compliance

- Kein neuer Runtime-, API- oder Datenbank-Scope; Umsetzung primar ueber bestehende Dokumentations- und Prozessartefakte.
- Single Source of Truth beibehalten:
  - `README.md` fuer kompakte Governance-/Navigationshinweise.
  - `react-md3/README.md` fuer operative KPI-Definitionen und Auswertungspfad.
- Terminologie bleibt konsistent zu Story 5.1/5.2 (`setup-fehler`, `toolchain-drift`, `api-regression`, `status:*` Labels).

### Library / Framework Requirements

- Fuer GitHub-basierte Reach-/Adoption-Signale nur bestehende Plattformdaten nutzen:
  - Repo-Metadaten (`stargazers_count`) via GitHub REST.
  - Traffic-Daten (Views/Clones) sind auf die letzten 14 Tage begrenzt und benoetigen passenden Zugriff.
  - Issue-basierte Signale ueber bestehendes Intake-Schema (`support-triage.yml`) und Label-/Status-Felder.
- Bei API-basierter Erhebung Rate-Limits beruecksichtigen (unauth/auth/GITHUB_TOKEN) und Erhebungscadence entsprechend planen.
- Bestehende Support-Governance unveraendert lassen: Node 22.x/24.x und `cd react-md3 && npm run quality:gate` als baseline check.

### File Structure Requirements

- Erwartete Haupt-Touchpoints:
  - `README.md` (Story-5.3-Verweis + Governance-Navigation)
  - `react-md3/README.md` (neue operative KPI-Section nach Story-5.2-Abschnitt)
  - Optional: dedizierter KPI-Snapshot-/Report-Artefaktpfad unter bestehender Doku-Struktur
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/5-3-kpi-tracking-fuer-adoption-und-time-to-value-etablieren.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Prozessvalidierung:
  - Mindestens ein exemplarischer KPI-Auswertungslauf mit nachvollziehbaren Eingabedaten und Ergebnissen.
  - Nachweis, dass definierte KPI-Werte releaseuebergreifend vergleichbar sind (gleiches Messfenster, gleiche Formel).
- Konsistenzvalidierung:
  - KPI-Definitionen referenzieren bestehende Intake-/Recovery-Artefakte statt paralleler Datenmodelle.
  - Keine Widersprueche zwischen Root-README, `react-md3/README.md` und Story-Artefakten.
- Baseline-Guardrail:
  - `cd react-md3 && npm run quality:gate`.

### Previous Story Intelligence

- Story 5.1 liefert bereits strukturierte Pflichtfelder (`problem_class`, `priority`, `verification_status`, `known_issue_ref`, `solution_path`) und Labels als auswertbare Signale.
- Story 5.2 etabliert reproduzierbare Recovery-Drills pro Problemklasse und ein klares Abschlusskriterium (`status:resolved` erst nach Verifikation).
- Fuer 5.3 gilt: diese vorhandenen Prozessdaten als KPI-Inputs wiederverwenden, keine Shadow-Tracking-Struktur erzeugen.

### Git Intelligence Summary

- Letzte Commits zeigen ein konsistentes Muster: Governance- und Prozessfaehigkeiten werden zuerst in reproduzierbaren Doku-/Workflow-Pfaden verankert.
- Relevante Historie:
  - `c75ac35` docs: complete story 5.2 recovery playbooks
  - `e32fb35` docs: complete story 5.1 support triage
  - `d45c492` docs: finalize story 4.3 governance
  - `2c45632` feat: finalize story 4.2 release gate automation
  - `f84457a` docs: complete story 4.1 release governance
- Ableitung fuer Story 5.3: KPI-Tracking zuerst als klare, testbare Prozessdefinition aufsetzen; danach optional automatisieren.

### Latest Tech Information

- GitHub-Traffic-Signale (Views/Clones/Referrer) sind fuer Repositories mit Push-/Write-Zugriff verfuegbar, aktualisieren in UTC und decken jeweils ein begrenztes Zeitfenster ab.
- REST-Traffic-Endpunkte liefern Clones/Views nur fuer die letzten 14 Tage; fuer trendfaehige Monats-/Release-Sichten sind periodische Snapshots erforderlich.
- REST API Rate Limits muessen bei regelmaessiger KPI-Erhebung eingeplant werden (insb. bei unauthenticated Zugriff und GITHUB_TOKEN in Actions).
- Fuer Time-to-Value-/Activation-Metriken sollten Definitionen ueber Zeit stabil bleiben; falls sich Definitionen aendern, muss das als Metrik-Version dokumentiert werden.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epic-/PRD-/Architektur-Artefakte, Story 5.1/5.2, Root-/Paket-README, Git-Historie und aktuelle Plattformdokumentation.

### Story Completion Status

- Status auf `done` gesetzt.
- Completion note: Senior Developer Review abgeschlossen; FR-Mapping fuer KPI-Tabelle korrigiert.

### Project Structure Notes

- Das Repository arbeitet fuer Governance- und Operationsinhalte ueber die README-Hierarchie (Root -> `react-md3/README.md`); KPI-Tracking muss diese Struktur fortsetzen.
- Support-Triage und Recovery sind bereits etabliert und liefern die primaren Datensignale fuer KPI-Bewertung in Story 5.3.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: Support, Recovery und Produktlernen]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.3: KPI-Tracking fuer Adoption und Time-to-Value etablieren]
- [Source: _bmad-output/planning-artifacts/prd.md#Success Criteria]
- [Source: _bmad-output/planning-artifacts/prd.md#Measurable Outcomes]
- [Source: _bmad-output/planning-artifacts/prd.md#Adoption & Product Learning]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: README.md#Story 5.1 Support-Triage und Known-Issues-Katalog]
- [Source: README.md#Story 5.2 Recovery-Playbooks fuer haeufige Fehlerszenarien]
- [Source: react-md3/README.md#6.12) Story 5.1 Support-Triage und Known-Issues-Katalog]
- [Source: react-md3/README.md#6.13) Story 5.2 Recovery-Playbooks fuer haeufige Fehlerszenarien]
- [Source: .github/ISSUE_TEMPLATE/support-triage.yml]
- [Source: git log -5 --oneline (2026-02-28)]
- [Source: https://docs.github.com/en/rest/metrics/traffic]
- [Source: https://docs.github.com/en/repositories/viewing-activity-and-data-for-your-repository/viewing-traffic-to-a-repository]
- [Source: https://docs.github.com/en/rest/using-the-rest-api/rate-limits-for-the-rest-api]
- [Source: https://amplitude.com/blog/time-to-value-drives-user-retention]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Workflow Config: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation Command: `cd react-md3 && npm run quality:gate` (PASS, 2026-02-28)

### Completion Notes List

- Root-README wurde um Story-5.3-Governance-Navigation auf den operativen KPI-Pfad erweitert.
- `react-md3/README.md` enthaelt in Abschnitt 6.14 das verbindliche KPI-Schema fuer FR28-FR31 inkl. Formeln, Baselines/Zielwerten, Triggern und Ownern.
- KPI-Formeln fuer `active-usage-ratio`, `ttv-setup-hours` und `setup-success-rate` enthalten explizite Nenner-Guards auf `insufficient-data`; Missing-Data-Markierung ist konsistent vereinheitlicht.
- Tracking-Pfade, Datenquellen-Mapping, Erhebungsprozess, Datenqualitaetsregeln und Story-5.4-Anschluss sind ohne neuen Runtime-Scope dokumentiert.
- Eine reproduzierbare Beispielauswertung (UTC-Snapshot) inkl. Massnahmenableitung wurde dokumentiert.
- Baseline-Guardrail erfolgreich ausgefuehrt: `cd react-md3 && npm run quality:gate` (PASS).

### Change Log

- 2026-02-28: Story 5.3 umgesetzt (KPI-Katalog FR28-FR31, Tracking-/Datenqualitaetsprozess, Trigger-/Massnahmenpfad, Story-5.4-Feedback-Loop, Beispielauswertung) und Status auf `review` gesetzt.
- 2026-02-28: Senior Developer Review (AI) abgeschlossen; KPI-FR-Mapping in `react-md3/README.md` korrigiert (`setup-success-rate` -> FR29, `continued-usage-rate` -> FR30); Status auf `done` gesetzt.
- 2026-02-28: Senior Developer Review (AI, rerun) fand High Findings zur `continued-usage-rate`-Formel; auf issue-basierten Retention-Proxy mit 30-Tage-Kohorte und `insufficient-data`-Guard korrigiert (`react-md3/README.md`); Status bleibt `done`.
- 2026-02-28: Senior Developer Review (AI, yolo rerun) fand 1 High + 1 Medium Finding (fehlende Nenner-Guards in zwei KPI-Formeln sowie inkonsistente Missing-Data-Markierung) und korrigierte diese in `react-md3/README.md`; `quality:gate` bleibt PASS, Status bleibt `done`.

### Senior Developer Review (AI)

- Reviewer: GPT-5.3-Codex
- Datum: 2026-02-28
- Outcome: **Approve** nach Fix von 1 High + 1 Medium Finding.
- Findings:
  - **HIGH:** `continued-usage-rate` nutzte eine nicht messbare `Folgeaktivitaet` ohne definierte Datenquelle. Behoben in `react-md3/README.md` durch issue-basierten Retention-Proxy (`erneuter setup-fehler <=30d`).
  - **HIGH:** `continued-usage-rate` war ohne expliziten `Nenner=0`-Guard und ohne klare 30-Tage-Kohorte im Nenner nicht robust/trendfaehig. Behoben in `react-md3/README.md` mit Guard auf `insufficient-data` und kohortenkonsistenter Formel.
  - **MEDIUM:** KPI-FR-Mapping war teilweise inkonsistent zur Epic-Definition (`setup-success-rate` FR30, `continued-usage-rate` FR31). Behoben in `react-md3/README.md`.
- Verifikation:
  - `cd react-md3 && npm run quality:gate` (PASS, 2026-02-28)
- Rerun (YOLO) Findings und Fix:
  - **HIGH:** `ttv-setup-hours` und `setup-success-rate` waren ohne expliziten Nenner-`0`-Guard nicht deterministisch. Behoben in `react-md3/README.md` durch Guard auf `insufficient-data`.
  - **MEDIUM:** Missing-Data-Markierung war zwischen `NO-DATA` und `insufficient-data` inkonsistent. Behoben in `react-md3/README.md` durch Vereinheitlichung auf `insufficient-data`.
  - Verifikation: `cd react-md3 && npm run quality:gate` (PASS, 2026-02-28)

### File List

- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/5-3-kpi-tracking-fuer-adoption-und-time-to-value-etablieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
