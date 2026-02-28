# Story 5.1: Support-Triage und Known-Issues-Katalog aufbauen

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Support-Verantwortlicher,
I want ein strukturiertes Triage-Schema mit bekannten Problemklassen,
so that ich wiederkehrende Integrationsprobleme schnell und konsistent einordnen kann.

## Acceptance Criteria

1. **Given** eingehende Support-Faelle aus typischen Integrationskontexten
   **When** ich das Triage-Schema anwende
   **Then** wird jeder Fall einer Problemklasse mit priorisierter Behandlung zugeordnet.
2. **And** bekannte Loesungswege sind zentral verlinkt und wiederverwendbar (FR25, FR27).

## Tasks / Subtasks

- [x] Triage-Schema und verbindliche Problemklassen fuer Support-Faelle definieren (AC: 1)
  - [x] Klassifikationsmodell auf bestehende Fehlerklassen ausrichten (`setup-fehler`, `toolchain-drift`, `api-regression`) und fuer Epic-5-Supportfaelle ergaenzen.
  - [x] Prioritaetsstufen mit klaren Kriterien dokumentieren (z. B. P1-P4 nach Nutzer-/Business-Impact) inkl. erwarteter Reaktionszeit.
  - [x] Pflichtfelder fuer jeden Fall festlegen (Kontext, Symptom, Reproduktion, Klasse, Prioritaet, Owner, Verifikationsstatus).
- [x] Zentralen Known-Issues-Katalog mit wiederverwendbaren Loesungspfaden aufbauen (AC: 2)
  - [x] Einheitliches Eintragsformat definieren (Titel, Problemklasse, Symptome, Root Cause, Workaround/Fix, Verifikationsschritte, Referenzlinks, Status).
  - [x] Mindestens die haeufigsten Integrationsfallgruppen aus bestehenden Troubleshooting-/CI-Fehlerbildern initial befllen.
  - [x] Duplikatstrategie festlegen (kanonischer Issue-Link + Verweise fuer Dubletten), damit Wissen nicht fragmentiert.
- [x] Triage-Intake und Routing fuer den operativen Ablauf verankern (AC: 1, 2)
  - [x] Eintrittspunkt definieren (GitHub Issues/Supportkanal) und Triage-Labels/Statuswerte standardisieren.
  - [x] Optionalen Einsatz von GitHub Issue Forms und Label-Automation als standardkonformen Intake dokumentieren.
  - [x] Sicherstellen, dass jeder klassifizierte Fall auf einen vorhandenen Loesungspfad oder einen neuen Known-Issue-Eintrag verweist.
- [x] Verifikation und Nachweisfuehrung fuer den neuen Support-Prozess durchfuehren (AC: 1, 2)
  - [x] Mindestens 3 reprasentative Supportfaelle (je Klasse) gegen das Triage-Schema durchspielen und Ergebnis dokumentieren.
  - [x] Konsistenz mit bestehenden Guardrails pruefen (`cd react-md3 && npm run quality:gate` als Basis-Check fuer Repo-Konsistenz).
  - [x] Story-Artefakte konsistent aktualisieren (`sprint-status.yaml`, Storydatei, Change Log).

## Dev Notes

### Developer Context

- Epic 5 adressiert Support, Recovery und Produktlernen; Story 5.1 ist die Grundlage fuer Story 5.2 (Recovery-Playbooks), 5.3 (KPI-Tracking) und 5.4 (Feedback-Loop).
- Es existieren bereits operative Fehlerklassen und Troubleshooting-Pfade aus Epic 3/4:
  - Klassifikation: `setup-fehler`, `toolchain-drift`, `api-regression`
  - Troubleshooting- und Playbook-Quellen in Root-README und `react-md3/README.md`.
- Im Repository sind aktuell keine `.github/ISSUE_TEMPLATE/*` Dateien vorhanden; ein strukturierter Intake muss daher bewusst eingefuehrt oder alternativ dokumentiert begruendet werden.

### Technical Requirements

- Primare FR-Abdeckung: FR25 (Support-Triage) und FR27 (zentrale Problemklassen + Loesungswege).
- Jeder eingehende Fall muss mindestens enthalten: Problemklasse, Prioritaet, reproduzierbarer Kontext, zugeordneter Loesungspfad und Owner.
- Known-Issues-Eintraege muessen suchbar und wiederverwendbar sein; Dubletten duerfen nicht zu separaten, widerspruechlichen Loesungsbeschreibungen fuehren.
- Triage-Ergebnisse sollen fuer spaetere Produktmetriken nutzbar sein (u. a. Time-to-Recovery/MTTR-Analyse in Story 5.3), ohne Scope von Story 5.1 in vollstaendiges KPI-Reporting auszudehnen.

### Architecture Compliance

- Scope ist prozess- und dokumentationszentriert; keine neue Runtime-API, kein Datenbank-Scope.
- Bestehende Governance- und Guardrail-Muster beibehalten:
  - Root-README als Einstieg und Policy-Referenz
  - `react-md3/README.md` als operative Detaildokumentation
  - Explizite Fehlerklassifikation statt stiller Sammelkategorien.
- Keine Shadow-Dokumentation aufbauen: neue Support-/Known-Issues-Pfade muessen auf vorhandene Troubleshooting- und Migrationspfade aufsetzen.

### Library / Framework Requirements

- Bestehende CI-/Tooling-Baselines bleiben unveraendert:
  - `react-md3/package.json` -> `quality:gate` (`lint && test && build && api:contract:check`)
  - Referenzintegration via `react-md3/reference-integration`.
- Falls strukturierter Intake ueber GitHub umgesetzt wird:
  - Issue Forms gemaess GitHub-Form-Syntax (`.github/ISSUE_TEMPLATE/*.yml`)
  - Label-Management kompatibel zu GitHub Actions Labeling Patterns.
- Severity-/Prioritaetsmodell soll operativ klar sein und kann an etablierte Incident-Stufen (z. B. P1-P4) angelehnt werden, solange Kriterien im Repo eindeutig dokumentiert sind.

### File Structure Requirements

- Erwartete Haupt-Touchpoints fuer diese Story:
  - `README.md` (kompakter Verweis auf Triage-/Known-Issues-Prozess und Einstiegspfad)
  - `react-md3/README.md` (operatives Triage-Schema, Problemklassen, Verweise auf bestehende Playbooks/Troubleshooting)
  - Optional `.github/ISSUE_TEMPLATE/` fuer strukturierte Intake-Formulare
  - Optional dedizierter Known-Issues-Katalog unter einem konsistenten Doku-Pfad (z. B. in bestehender README-Struktur oder klar verlinkter Datei).
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/5-1-support-triage-und-known-issues-katalog-aufbauen.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Prozess-/Abnahmevalidierung:
  - 3+ reprasentative Supportfaelle durchspielen und korrekt klassifizieren.
  - Pro Fall mindestens ein verlinkter Loesungspfad mit Verifikationsschritten nachweisen.
- Konsistenzvalidierung:
  - Terminologie bleibt kompatibel zu vorhandenen Klassen (`setup-fehler`, `toolchain-drift`, `api-regression`).
  - Keine Widersprueche zwischen Root-README, `react-md3/README.md` und ggf. neuen Known-Issues-Artefakten.
- Baseline-Guardrail:
  - `cd react-md3 && npm run quality:gate`.

### Git Intelligence Summary

- Letzte Commits zeigen ein konsistentes Muster: Governance und Prozessstandards werden primaer ueber Doku- und Workflow-Updates eingefuehrt.
- Relevante Historie:
  - `d45c492` docs: finalize story 4.3 governance
  - `2c45632` feat: finalize story 4.2 release gate automation
  - `f84457a` docs: complete story 4.1 release governance
  - `07f4d4d` feat: complete story 3.4 reference integration
  - `92b3721` feat: complete story 3.3 migration path
- Ableitung fuer Story 5.1: zuerst klare Governance-Definition und operative Dokumentation, danach optionale Workflow-/Automation-Erweiterungen.

### Latest Tech Information

- GitHub empfiehlt strukturierte Issue Forms fuer reproduzierbare Intake-Daten (Symptom, Reproduktion, Kontext) und konfigurierbare Labels/Assignees pro Formular.
- GitHub-Dokumentation fuer Label-Automation und Triage-Prozesse kann zur konsistenten Erstklassifikation genutzt werden.
- Fuer Support-Triage ist ein explizites Severity-/Prioritaetsmodell (z. B. P1-P4) mit klaren SLA- und MTTR-Bezuegen branchenueblich; entscheidend ist die im Repo dokumentierte, einheitliche Anwendung.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, bestehende Story-Artefakte aus Epic 3/4, Root-/Paket-README, Git-Historie und aktuelle Web-Recherche.

### Story Completion Status

- Status auf `done` gesetzt.
- Completion note: Implementation, adversariales Review und Follow-up-Fixes abgeschlossen.

### Project Structure Notes

- Das Repository arbeitet operativ ueber Root-README plus `react-md3/README.md`; Support- und Triage-Prozesse muessen diese Hierarchie beibehalten.
- Bestehende Fehlerklassifikation und Troubleshooting-Playbooks sind bereits etabliert und sollten als Fundament fuer den Known-Issues-Katalog wiederverwendet werden.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: Support, Recovery und Produktlernen]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.1: Support-Triage und Known-Issues-Katalog aufbauen]
- [Source: _bmad-output/planning-artifacts/prd.md#Support & Recovery Capabilities]
- [Source: _bmad-output/planning-artifacts/prd.md#Adoption & Product Learning]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: README.md#Story 1.4 Troubleshooting-Basis (Schema: Symptom -> Diagnose -> Fix -> Verifikation)]
- [Source: README.md#Story 3.1 Kompatibilitaetsmatrix und CI-Absicherung]
- [Source: README.md#Story 3.2 Integrationsrezepte fuer gaengige Team-Setups]
- [Source: react-md3/README.md#6.5) Story 3.2 Integrationsrezepte fuer gaengige Team-Setups]
- [Source: react-md3/README.md#6.75) Story 3.3 Migrationspfad fuer API-Aenderungen]
- [Source: react-md3/README.md#7) Troubleshooting (Schema: Symptom -> Diagnose -> Fix -> Verifikation)]
- [Source: git log -5 --pretty=format:'%h %s' (2026-02-27)]
- [Source: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms]
- [Source: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository]
- [Source: https://docs.github.com/en/actions/tutorials/manage-your-work/add-labels-to-issues]
- [Source: https://docs.github.com/en/issues/tracking-your-work-with-issues/administering-issues/triaging-an-issue-with-ai]
- [Source: https://www.atlassian.com/incident-management/kpis/common-metrics]

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

- Support-Triage-Prozess mit verbindlichen Problemklassen, P1-P4-Priorisierung und Pflichtfeldern in `react-md3/README.md` Section 6.12 verankert.
- Zentralen Known-Issues-Katalog mit kanonischen Eintraegen fuer `setup-fehler`, `toolchain-drift` und `api-regression` inkl. Duplikatstrategie eingefuehrt.
- Strukturierter Intake ueber `.github/ISSUE_TEMPLATE/support-triage.yml` hinzugefuegt und Routing-/Label-Standard im Readme dokumentiert.
- Root-README um Story-5.1-Verweis auf den operativen Prozess erweitert.
- Konsistenz mit bestehenden Guardrails via `cd react-md3 && npm run quality:gate` vor und nach den Anpassungen erfolgreich verifiziert.

### File List

- _bmad-output/implementation-artifacts/5-1-support-triage-und-known-issues-katalog-aufbauen.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- README.md
- react-md3/README.md
- .github/ISSUE_TEMPLATE/support-triage.yml

## Senior Developer Review (AI)

### Reviewer

GPT-5.3-Codex (adversariales Review)

### Outcome

Changes Applied

### Findings

- High: 1
- Medium: 2
- Low: 0
- Git-vs-Story-Abweichungen: 0

### Fixed Findings

1. [High] Intake-Form erzwingt den Loesungspfad nicht, obwohl er als Pflichtfeld dokumentiert ist (`.github/ISSUE_TEMPLATE/support-triage.yml`).
2. [Medium] Issue-Titel war statisch und nicht suchfreundlich; jetzt ueber Pflicht-Kurzbeschreibung dynamisch (`.github/ISSUE_TEMPLATE/support-triage.yml`).
3. [Medium] Troubleshooting-Text war inkonsistent zum Supportfenster (24.x-only statt 22.x/24.x) (`react-md3/README.md`).

### Change Log

- 2026-02-27: Story 5.1 erzeugt und Status auf `ready-for-dev` gesetzt.
- 2026-02-28: Story 5.1 umgesetzt; Triage-Schema, Known-Issues-Katalog, Intake-Form und Routing dokumentiert, quality:gate vor/nach Aenderungen erfolgreich, Status auf `review` gesetzt.
- 2026-02-28: Senior-Code-Review (YOLO) durchgefuehrt; 3 Findings behoben und Story auf `done` gesetzt.
