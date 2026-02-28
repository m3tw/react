# Story 5.4: Feedback-Loop fuer Priorisierung und Roadmap verankern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Product-Team,
I want einen strukturierten Prozess zur Erfassung und Bewertung von Nutzerfeedback,
so that wir Priorisierungsentscheidungen kontinuierlich am realen Bedarf ausrichten koennen.

## Acceptance Criteria

1. **Given** Feedback aus Support, Issues und Nutzungssignalen
   **When** die Priorisierung fuer den naechsten Zyklus erfolgt
   **Then** sind Entscheidungen mit transparenten Kriterien und Daten begruendet.
2. **And** relevante Feedbackpunkte werden nachvollziehbar in Backlog oder Roadmap ueberfuehrt (FR32, FR28).

## Tasks / Subtasks

- [x] Feedback-Eingangskanaele und Priorisierungsdaten konsolidieren (AC: 1, 2)
  - [x] Verbindliche Input-Klassen definieren: Support-Triage-Faelle, KPI-Trigger aus Story 5.3, offene Produkt-Issues/Discussions.
  - [x] Minimales Datenschema fuer Priorisierungsentscheidungen festlegen (`feedback_id`, `source_type`, `problem_class`, `kpi_id`, `impact`, `urgency`, `confidence`, `owner`, `decision_status`, `target_cycle`, `snapshot_at_utc`).
  - [x] Traceability-Regel verankern: jede priorisierte Entscheidung muss auf Issue/Known-Issue/KPI-Snapshot verlinken.
- [x] Priorisierungslogik und Entscheidungsablauf dokumentieren (AC: 1)
  - [x] Bewertungsraster mit transparenten Kriterien definieren (z. B. Impact x Dringlichkeit x Evidenzqualitaet) inkl. klarer Schwellen fuer `backlog`, `roadmap`, `expedite`.
  - [x] Verbindlichen Ablauf dokumentieren: `Beobachtung -> Analyse -> Priorisierung -> Roadmap-Entscheid -> Rueckkopplung`.
  - [x] Rollen und Freigabeweg fuer kritische Entscheidungen festlegen (Product Owner + Maintainer/DX Owner, kein Self-Approval bei Eskalationen).
- [x] Rueckkopplung in Backlog/Roadmap und KPI-Auswertung operationalisieren (AC: 2)
  - [x] Pflichtfelder aus Story 5.3 fuer den Uebergang uebernehmen (`kpi_id`, `snapshot_at_utc`, `delta_vs_target`, `proposed_action`, `owner`, `expected_effect_window`).
  - [x] Zielartefakt pro Entscheidung festlegen (Backlog-Item, Roadmap-Entry oder dokumentiert deferred mit Begruendung).
  - [x] Closure-Kriterien fuer Wirksamkeit definieren (Folgesnapshot, erwarteter Effekt, Entscheidung bleibt/nachsteuern).
- [x] Validierung und Nachweisfuehrung ausfuehren (AC: 1, 2)
  - [x] Mindestens 3 reprasentative End-to-End-Faelle durchspielen (support-getrieben, KPI-getrieben, gemischte Signale) inkl. finaler Priorisierungsentscheidung.
  - [x] Konsistenz gegen Story-5.1/5.2-Taxonomie und Story-5.3-KPI-Regeln pruefen.
  - [x] Repo-Guardrail als Baseline ausfuehren: `cd react-md3 && npm run quality:gate`.

## Dev Notes

### Developer Context

- Story 5.1 etablierte Intake, Problemklassen und Labelrouting; Story 5.2 operationalisierte Recovery-Playbooks; Story 5.3 definierte KPI-Snapshots und Trigger.
- Story 5.4 schliesst den Loop: aus eingehendem Feedback und KPI-Abweichungen werden priorisierte, rueckmessbare Produktentscheidungen fuer Backlog/Roadmap.
- Scope bleibt dokumentations- und prozessorientiert (kein neuer Runtime-, API- oder Datenbank-Scope).

### Technical Requirements

- Primaere FR-Abdeckung: FR32 (strukturiertes Feedback in Priorisierung), FR28 (aktive Nutzung als Priorisierungssignal); Signale aus FR29-FR31 muessen als Evidenzquellen anschliessbar bleiben.
- Jede Priorisierungsentscheidung muss mindestens enthalten: Datenquelle, Bewertungslogik, Entscheidung, Owner, Zielzyklus, erwartetes Wirkfenster, Rueckmesskriterium.
- Entscheidungen muessen nachvollziehbar und auditierbar sein (kein "Bauchgefuehl-only", keine nicht belegte Priorisierung).
- Fehlende Daten duerfen nicht still ersetzt werden; `insufficient-data` bleibt explizit markiert und blockiert harte Entscheidungen ohne Risikoabschwaechung.

### Architecture Compliance

- Single Source of Truth beibehalten:
  - `README.md` fuer kompakte Governance-Navigation.
  - `react-md3/README.md` fuer operative Prozessdetails und Entscheidungsregeln.
- Bestehende Taxonomie und Prozesslabels bleiben unveraendert: `setup-fehler`, `toolchain-drift`, `api-regression`, sowie `status:incoming|classified|known-issue-linked|resolved`.
- Keine neuen Services oder Persistenzpfade; Umsetzung ueber bestehende Repo-Artefakte, Issues, Labels und dokumentierte Workflows.
- Bestehende Governance-Regeln zu 2-Augen-Freigaben und dokumentierten No-Go/Gegenmassnahmen sind bei priorisierungsrelevanten Eskalationen einzuhalten.

### Library / Framework Requirements

- GitHub Issue Forms (`.github/ISSUE_TEMPLATE/*.yml`) unterstuetzen Pflichtfelder, Labels und optionale Projektzuordnung; dieses Schema bleibt Grundlage fuer strukturierte Inputs.
- GitHub Projects bietet Table/Board/Roadmap-Views, Custom Fields und Automations; kann fuer Priorisierungs- und Roadmap-Sichten ohne zusaetzliche Infrastruktur genutzt werden.
- GitHub Traffic Endpunkte liefern nur 14 Tage (UTC-ausgerichtet) und erfordern passende Berechtigungen; deshalb bleiben periodische Snapshots aus Story 5.3 verpflichtend.
- Bei API-/Automationsnutzung muessen Token-Scopes und Zugriffsrechte least-privilege-konform bleiben.

### File Structure Requirements

- Erwartete Haupt-Touchpoints fuer Implementierung:
  - `README.md` (Story-5.4-Navigation auf operativen Prozess).
  - `react-md3/README.md` (neuer Abschnitt fuer Feedback-Loop/Priorisierungsprozess).
  - Optional `.github/ISSUE_TEMPLATE/support-triage.yml` nur falls fuer priorisierungsrelevante Pflichtfelder minimal ergaenzt.
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/5-4-feedback-loop-fuer-priorisierung-und-roadmap-verankern.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Prozessvalidierung:
  - Drei End-to-End-Faelle mit Input -> Bewertung -> Entscheidung -> Backlog/Roadmap-Output -> Rueckmessplan.
  - Jede Entscheidung besitzt verlinkte Evidenz und klare Owner-Zuordnung.
- Konsistenzvalidierung:
  - Taxonomie/Labels aus Story 5.1/5.2 bleiben konsistent.
  - KPI-Uebergabefelder aus Story 5.3 sind vollstaendig und korrekt uebernommen.
  - Keine Widersprueche zwischen Root-README, `react-md3/README.md` und Story-Artefakt.
- Baseline-Guardrail:
  - `cd react-md3 && npm run quality:gate`.

### Previous Story Intelligence

- Story 5.3 liefert den verpflichtenden Inputvertrag fuer Story 5.4 (`kpi_id`, `snapshot_at_utc`, `delta_vs_target`, `proposed_action`, `owner`, `expected_effect_window`).
- Story 5.3 definiert klare Trigger, die direkt als Priorisierungsinput uebernommen werden muessen (z. B. `active-usage-ratio`, `ttv-setup-hours`, `setup-success-rate`, `continued-usage-rate`).
- Story 5.1/5.2 sorgen fuer reproduzierbare, klassifizierte Support-Signale; Story 5.4 darf diese nicht neu modellieren, sondern muss sie wiederverwenden.

### Git Intelligence Summary

- Letzte Commits zeigen ein stabiles Muster: Governance- und Operationsfaehigkeit wird primar in README-Hierarchie plus Story-Artefakten verankert.
- Relevante Historie:
  - `91500de` docs: complete story 5.3 KPI tracking
  - `c75ac35` docs: complete story 5.2 recovery playbooks
  - `e32fb35` docs: complete story 5.1 support triage
  - `d45c492` docs: finalize story 4.3 governance
  - `2c45632` feat: finalize story 4.2 release gate automation
- Ableitung fuer 5.4: zuerst klaren, testbaren Priorisierungsprozess dokumentieren; erst danach optionale Automatisierung schrittweise ergaenzen.

### Latest Tech Information

- GitHub Projects ist weiterhin als flexibles Planungswerkzeug mit Table/Board/Roadmap, Custom Fields und Built-in Automations ausgelegt; geeignet fuer Feedback-Priorisierung ohne Zusatzsystem.
- Issue Forms in YAML bleiben in Public Preview und koennen Pflichtfelder, Labels, Assignees und Projektzuordnung definieren; Struktur muss daher bewusst stabil und minimal gehalten werden.
- Traffic-Metriken fuer `views`/`clones` bleiben auf letzte 14 Tage begrenzt und UTC-ausgerichtet; periodische Snapshots bleiben zwingend fuer trendfaehige Priorisierungsinputs.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epic-/PRD-/Architektur-Artefakte, Story 5.3, aktuelle Repo-READMEs, Support-Issue-Template und Git-Historie.

### Story Completion Status

- Status auf `done` gesetzt (nach Senior Developer Review).
- Completion note: Ultimate context engine analysis completed - comprehensive developer guide created.

### Project Structure Notes

- Das Repo nutzt fuer Governance-/Operationsinhalte die README-Hierarchie (Root -> `react-md3/README.md`); Story 5.4 muss dieses Muster fortsetzen.
- Priorisierungslogik sollte an bestehende Labels/Issue-Artefakte andocken, statt parallele Datenstrukturen einzufuehren.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.4: Feedback-Loop fuer Priorisierung und Roadmap verankern]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: Support, Recovery und Produktlernen]
- [Source: _bmad-output/planning-artifacts/prd.md#Adoption & Product Learning]
- [Source: _bmad-output/planning-artifacts/prd.md#Measurable Outcomes]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/5-3-kpi-tracking-fuer-adoption-und-time-to-value-etablieren.md#Previous Story Intelligence]
- [Source: README.md#Story 5.3 KPI-Tracking fuer Adoption und Time-to-Value etablieren]
- [Source: react-md3/README.md#6.14) Story 5.3 KPI-Tracking fuer Adoption und Time-to-Value etablieren]
- [Source: react-md3/README.md#6.12) Story 5.1 Support-Triage und Known-Issues-Katalog]
- [Source: .github/ISSUE_TEMPLATE/support-triage.yml]
- [Source: git log -5 --oneline (2026-02-28)]
- [Source: https://docs.github.com/en/issues/planning-and-tracking-with-projects/learning-about-projects/about-projects]
- [Source: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms]
- [Source: https://docs.github.com/en/rest/metrics/traffic]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Workflow Config: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation Command: `cd react-md3 && npm run quality:gate` (PASS, 2026-02-28; baseline + final)

### Completion Notes List

- Root-README um Story-5.4-Governance-Navigation auf den operativen Feedback-Loop erweitert.
- `react-md3/README.md` in Abschnitt 6.15 um verbindliche Input-Klassen, Datenschema, Traceability-Regel, Priorisierungsraster und Freigabeweg erweitert.
- Story-5.3-Pflichtfelder (`kpi_id`, `snapshot_at_utc`, `delta_vs_target`, `proposed_action`, `owner`, `expected_effect_window`) sind als Uebergabevertrag fuer Priorisierungsentscheidungen dokumentiert.
- Drei reprasentative End-to-End-Faelle (support-getrieben, KPI-getrieben, gemischte Signale) inkl. finaler Entscheidungszuordnung sind dokumentiert.
- Repo-Guardrail erfolgreich ausgefuehrt: `cd react-md3 && npm run quality:gate` (PASS, 2026-02-28).

### Change Log

- 2026-02-28: Story 5.4 umgesetzt (Feedback-Loop fuer Priorisierung/Roadmap, Datenschema, Bewertungsraster, Entscheidungsablauf, E2E-Nachweise, Konsistenzchecks) und Status auf `review` gesetzt.
- 2026-02-28: Senior Developer Review (AI) im YOLO-Modus durchgefuehrt; minor Inkonsistenz im Story-Completion-Status korrigiert; Status auf `done` gesetzt.

### File List

- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/5-4-feedback-loop-fuer-priorisierung-und-roadmap-verankern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Senior Developer Review (AI)

### Reviewer

- Darko (GPT-5.3-Codex), 2026-02-28

### Ergebnis

- **Approve** (nach 1 korrigiertem Low-Finding)
- AC-Check: **AC1 erfuellt**, **AC2 erfuellt**
- Guardrail-Check: `cd react-md3 && npm run quality:gate` **PASS**

### Findings

1. **LOW** - Inkonsistenter Story-Completion-Status in der Story-Datei.
   - Befund: Der Abschnitt "Story Completion Status" enthielt noch `ready-for-dev`, obwohl die Story bereits im Review war.
   - Evidenz: `_bmad-output/implementation-artifacts/5-4-feedback-loop-fuer-priorisierung-und-roadmap-verankern.md` (Abschnitt "Story Completion Status")
   - Fix: Status-Hinweis auf `done` aktualisiert.

### Git-vs-Story File-List Abgleich

- Keine Diskrepanz festgestellt (Story File List deckt die geaenderten Dateien korrekt ab).
