# Story 5.2: Recovery-Playbooks fuer haeufige Fehlerszenarien liefern

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Entwickler bei Produktionsproblemen,
I want klare Recovery-Playbooks fuer kritische Fehlerbilder,
so that ich schnell von Fehlern in einen stabilen Betriebszustand zurueckkehren kann.

## Acceptance Criteria

1. **Given** dokumentierte Fehlerszenarien mit hoher Relevanz
   **When** ich ein Recovery-Playbook ausfuehre
   **Then** sind Diagnose, Sofortmassnahme und Verifikation eindeutig beschrieben.
2. **And** der Ablauf ist ohne Abhaengigkeit von zukuenftigen Stories durchfuehrbar (FR26, FR27).

## Tasks / Subtasks

- [x] Recovery-Playbook-Standard fuer Epic-5-Supportfaelle definieren (AC: 1, 2)
  - [x] Einheitliches Format pro Playbook festlegen: Trigger, Severity, Diagnose, Sofortmassnahme, Verifikation, Rollback/Eskalation, Abschlussupdate.
  - [x] Rollenmodell fuer Incident-Bearbeitung dokumentieren (Incident Commander/Owner, Ops, Kommunikation) und auf das Maintainer-Setup im Repo zuschneiden.
  - [x] Verbindliche Verlinkung auf Triage-Klassen und Known-Issue-IDs (`KI-001` bis `KI-003` bzw. neue kanonische Eintraege) definieren.
- [x] Mindestens 3 haeufige Fehlerszenarien als sofort nutzbare Recovery-Playbooks dokumentieren (AC: 1, 2)
  - [x] `setup-fehler`: Setup-/Package-Manager-Ausfall mit schneller Stabilisierung und reproduzierbarer Verifikation.
  - [x] `toolchain-drift`: Matrix-/Build-Abweichungen lokal vs. CI mit Rueckfuehrung auf das Supportfenster 22.x/24.x.
  - [x] `api-regression`: Contract-/Public-API-Drift mit klarer Reihenfolge fuer Contract-, Changelog- und Quality-Gate-Synchronisierung.
- [x] Operativen Ablauf von Intake -> Triage -> Recovery -> Verifikation schliessen (AC: 1, 2)
  - [x] Schrittfolge im README so verankern, dass ein klassifizierter Fall ohne Zusatzwissen in ein passendes Playbook ueberfuehrt wird.
  - [x] Eskalationsregeln fuer P1/P2-Faelle und Kriterien fuer Rollback vs. Forward-Fix dokumentieren.
  - [x] Abschlusskriterium festlegen: Fall wird erst nach erfolgreicher Verifikation und dokumentiertem Ergebnis auf `status:resolved` gesetzt.
- [x] Reproduzierbare Validierung der Playbooks nachweisen (AC: 1, 2)
  - [x] Mindestens 3 reprasentative Recovery-Drills (je Klasse) per Dry-Run durchfuehren und Ergebnis dokumentieren.
  - [x] Baseline-Guardrail ausfuehren: `cd react-md3 && npm run quality:gate`.
  - [x] Story-Artefakte konsistent aktualisieren (`sprint-status.yaml`, Story-Datei, relevante README-Abschnitte).

## Dev Notes

### Developer Context

- Story 5.1 hat bereits den operativen Intake, Problemklassen (`setup-fehler`, `toolchain-drift`, `api-regression`), Priorisierung (P1-P4) und Known-Issue-Katalog etabliert.
- Story 5.2 liefert den naechsten operativen Schritt: aus klassifizierten Faellen direkt ausfuehrbare Recovery-Pfade mit klarer Diagnose-, Mitigations- und Verifikationskette.
- Bestehende Playbook-/Troubleshooting-Inhalte in Root-README und `react-md3/README.md` sollen konsolidiert genutzt werden; keine Shadow-Dokumentation aufbauen.

### Technical Requirements

- Primaere FR-Abdeckung: FR26 (strukturierte Recovery-Pfade) und FR27 (zentrale Problemklassen + Loesungswege).
- Jedes Recovery-Playbook muss mindestens enthalten:
  1. Trigger/Symptom
  2. Diagnose
  3. Sofortmassnahme (time-critical mitigation)
  4. Verifikation
  5. Eskalation oder Rollback/Forward-Fix-Entscheidung
  6. Abschluss-/Dokumentationsschritt
- Die Story muss ohne Abhaengigkeit zu Story 5.3/5.4 direkt nutzbar sein; KPI- oder Feedback-Loop-Themen nur als Verweis, nicht als Implementationsblocker.

### Architecture Compliance

- Kein neuer Runtime-, API- oder Datenbank-Scope; Fokus bleibt auf Prozess- und Dokumentationsartefakten.
- Single Source of Truth beibehalten:
  - Root-README fuer Einstieg/Governance
  - `react-md3/README.md` fuer operative Detailprozesse
- Bestehende Klassifikations- und Guardrail-Sprache konsistent halten (`setup-fehler`, `toolchain-drift`, `api-regression`; `quality:gate` als zentraler Nachweis).

### Library / Framework Requirements

- Supportfenster und Toolchain-Governance aus Epic 3/5 beibehalten:
  - Node: 22.x und 24.x
  - Guardrail-Befehl: `cd react-md3 && npm run quality:gate`
- Fuer `api-regression`-Recovery muss die bestehende Contract-Governance beruecksichtigt werden:
  - `npm run api:contract:check`
  - `public-api.contract.json` und `CHANGELOG.md` synchron halten
- Der vorhandene strukturierte Intake (`.github/ISSUE_TEMPLATE/support-triage.yml`) bleibt Eingangsstandard fuer Recovery-Faelle.

### File Structure Requirements

- Erwartete Haupt-Touchpoints:
  - `README.md` (kompakte Governance-Verweise auf Recovery-Prozess)
  - `react-md3/README.md` (operative Recovery-Playbooks und Verifikationsablaeufe)
  - Optional: `.github/ISSUE_TEMPLATE/support-triage.yml` nur falls zusaetzliche Pflichtfelder noetig sind
- Story-Artefakte:
  - `_bmad-output/implementation-artifacts/5-2-recovery-playbooks-fuer-haeufige-fehlerszenarien-liefern.md`
  - `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Testing Requirements

- Prozess-/Abnahmevalidierung:
  - Pro Problemklasse mindestens ein dokumentierter Recovery-Dry-Run (3 Gesamtfaelle).
  - Jeder Dry-Run muss Diagnose, Sofortmassnahme und Verifikation explizit nachweisen.
- Konsistenzvalidierung:
  - Playbooks nutzen dieselben Klassen/Labels wie Story 5.1.
  - Keine Widersprueche zwischen Root-README, `react-md3/README.md` und Known-Issues-Katalog.
- Baseline-Guardrail:
  - `cd react-md3 && npm run quality:gate`.

### Previous Story Intelligence

- Story 5.1 hat einen verbindlichen Intake mit Pflichtfeldern und `solution_path`-Pflicht etabliert; Recovery-Playbooks muessen diesen Pfad direkt konsumierbar machen.
- Der kanonische Known-Issues-Katalog (`KI-001` bis `KI-003`) verhindert Wissensduplikate; neue Recovery-Inhalte sollen daran anknuepfen statt parallele Strukturen zu erzeugen.
- Korrigierte Supportfenster-Konvention aus Story 5.1 bleibt verbindlich (Node 22.x/24.x statt 24.x-only).

### Git Intelligence Summary

- Letzte Commits zeigen ein klares Muster: Governance- und Prozessaenderungen werden zuerst in dokumentierten, reproduzierbaren Ablaufketten verankert.
- Relevante Historie:
  - `e32fb35` docs: complete story 5.1 support triage
  - `d45c492` docs: finalize story 4.3 governance
  - `2c45632` feat: finalize story 4.2 release gate automation
  - `f84457a` docs: complete story 4.1 release governance
  - `07f4d4d` feat: complete story 3.4 reference integration
- Ableitung fuer Story 5.2: Recovery-Playbooks als operatives Bindeglied zwischen Klassifikation (Story 5.1) und reproduzierbarer Problembehebung ausrollen.

### Latest Tech Information

- Incident-Response-Runbooks sollten klare Rollen, Trigger, Schweregrad und einen sequenziellen Ablauf (Diagnose -> Mitigation -> Verifikation -> Post-Incident-Update) enthalten, um ad-hoc-Aktionen unter Stress zu vermeiden.
- GitHub Issue Forms erlauben weiterhin strukturierte Pflichtfelder, Default-Labels und konsistente Intake-Schemata fuer Support-/Recovery-Faelle unter `.github/ISSUE_TEMPLATE/*.yml`.
- Fuer dieses Repo bedeutet das: Recovery-Playbooks muessen mit dem bestehenden Form-Intake und den bereits standardisierten Labels/Problemklassen nahtlos zusammenspielen.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 5.1, Root-/Paket-README, aktuelle Git-Historie und Web-Recherche.

### Story Completion Status

- Status auf `done` gesetzt.
- Completion note: Senior-Developer-Review abgeschlossen; Recovery-Drill-Nachweise und Verifikationscommands konsistent nachgeschaerft.

### Project Structure Notes

- Das Repo nutzt eine README-Hierarchie (Root -> `react-md3/README.md`) fuer Governance und operative Tiefe; Recovery-Playbooks muessen diese Struktur strikt weiterfuehren.
- Bereits vorhandene Troubleshooting- und Migrationspfade (Story 1.4, 3.3, 3.4, 5.1) sind zu referenzieren und nicht zu duplizieren.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Epic 5: Support, Recovery und Produktlernen]
- [Source: _bmad-output/planning-artifacts/epics.md#Story 5.2: Recovery-Playbooks fuer haeufige Fehlerszenarien liefern]
- [Source: _bmad-output/planning-artifacts/prd.md#Support & Recovery Capabilities]
- [Source: _bmad-output/planning-artifacts/prd.md#Quality Governance & Release Readiness]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/5-1-support-triage-und-known-issues-katalog-aufbauen.md]
- [Source: README.md#Story 5.1 Support-Triage und Known-Issues-Katalog]
- [Source: react-md3/README.md#6.12) Story 5.1 Support-Triage und Known-Issues-Katalog]
- [Source: react-md3/README.md#7) Troubleshooting (Schema: Symptom -> Diagnose -> Fix -> Verifikation)]
- [Source: .github/ISSUE_TEMPLATE/support-triage.yml]
- [Source: git log -5 --oneline (2026-02-28)]
- [Source: https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/syntax-for-issue-forms]
- [Source: https://sre.google/sre-book/managing-incidents/]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Workflow Config: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Review Workflow Config: `_bmad/bmm/workflows/4-implementation/code-review/workflow.yaml`
- Review Instructions: `_bmad/bmm/workflows/4-implementation/code-review/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Completion Notes List

- Story 5.2 wurde in Root-README und `react-md3/README.md` mit einem konsistenten Recovery-Playbook-Standard umgesetzt.
- In `react-md3/README.md` (Abschnitt 6.13) wurden Rollenmodell, Eskalationsregeln (P1/P2), Rollback-vs-Forward-Fix-Kriterien und drei sofort nutzbare Playbooks (`setup-fehler`, `toolchain-drift`, `api-regression`) dokumentiert.
- Operativer Ablauf Intake -> Triage -> Recovery -> Verifikation wurde verbindlich verankert; `status:resolved` ist explizit an erfolgreiche Verifikation gebunden.
- Recovery-Drills (R1-R3, je Problemklasse) wurden als Dry-Run-Nachweis dokumentiert und mit Known-Issue-Referenzen gekoppelt.
- Baseline-Guardrail wurde erfolgreich ausgefuehrt: `cd react-md3 && npm run quality:gate` (PASS).

### Senior Developer Review (AI)

- Ergebnis: Approve after fixes.
- Finding (MEDIUM): Optionaler Verifikationspfad fuer Referenzintegration war ohne reproduzierbaren Install-Schritt dokumentiert (`npm run ci:smoke` ohne `npm ci`).
  - Fix: Command auf `cd react-md3/reference-integration && npm ci && npm run ci:smoke` korrigiert.
- Finding (MEDIUM): Recovery-Drills waren nur als Schema beschrieben, aber ohne expliziten aktuellen PASS-Nachweis.
  - Fix: Abschnitt "Aktueller Dry-Run-Nachweis (2026-02-28, lokal)" mit PASS-Ergebnissen fuer R1-R3 ergänzt.
- Finding (LOW): Story-Metadaten waren inkonsistent (`Status: review` und Story Completion Status `ready-for-dev`).
  - Fix: Story-Status und Completion-Status auf `done` harmonisiert.

### Change Log

- 2026-02-28: Story 5.2 implementiert (Recovery-Playbook-Standard, drei Playbooks, Eskalations-/Verifikationsprozess, Dry-Run-Nachweis, Story-/Sprint-Status auf `review`).
- 2026-02-28: Senior-Developer-Review abgeschlossen; Findings behoben (Referenzintegrations-Command, explizite Dry-Run-PASS-Nachweise, Story-Status-Konsistenz) und Story auf `done` gesetzt.

### File List

- README.md
- react-md3/README.md
- _bmad-output/implementation-artifacts/5-2-recovery-playbooks-fuer-haeufige-fehlerszenarien-liefern.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
