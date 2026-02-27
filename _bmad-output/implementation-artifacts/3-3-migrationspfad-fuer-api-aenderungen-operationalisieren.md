# Story 3.3: Migrationspfad fuer API-Aenderungen operationalisieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Entwickler bei Versionswechseln,  
I want handlungsorientierte Migrationsempfehlungen pro relevanter Aenderung,  
so that ich Breaking Changes kontrolliert und mit geringem Aufwand umsetzen kann.

## Acceptance Criteria

1. **Given** eine API-Aenderung mit Migrationsbedarf  
   **When** ich Changelog und Migration Guide konsumiere  
   **Then** sind alte und neue Nutzung eindeutig gegenuebergestellt.
2. **And** der Migrationsweg ist mit reproduzierbaren Codebeispielen belegt (FR11).

## Tasks / Subtasks

- [x] Migrationsumfang und Trigger pro API-Aenderung operationalisieren (AC: 1, 2)
  - [x] Verbindliche Trigger definieren, wann ein Migrationseintrag Pflicht ist (Deprecation, Breaking Change, relevante Verhaltensaenderung).
  - [x] Einheitliches Mapping je Aenderung festlegen: `alt -> neu`, betroffene Exports/Pfade, Risikoeinschaetzung, Verifikationsschritt.
  - [x] Konsistente Verbindung zwischen `changeType` (patch/minor/major) und Migrationstiefe dokumentieren.
- [x] Migrationspfad in bestehender Doku sichtbar und handlungsorientiert machen (AC: 1, 2)
  - [x] Root-README um klaren Einstieg "Welche Aenderung betrifft mich?" erweitern und auf den Paketpfad verlinken.
  - [x] `react-md3/README.md` um konkrete Migrationsplaybooks erweitern (mindestens additive API + Breaking-Change-Szenario).
  - [x] Fuer jedes Playbook reproduzierbare Vorher/Nachher-Codebeispiele liefern, nur ueber Public API (keine Deep-Imports).
- [x] Changelog- und Contract-Governance als durchgaengigen Migrationspfad absichern (AC: 1, 2)
  - [x] `react-md3/CHANGELOG.md`-Schema auf Migrationsnutzbarkeit pruefen und fuer Nutzer sichtbare Struktur schaerfen.
  - [x] Sicherstellen, dass `public-api.contract.json` und `CHANGELOG.md` dieselben Aenderungsfakten transportieren.
  - [x] Falls noetig `react-md3/scripts/check-api-contract.mjs` punktuell erweitern, damit unzureichende Migrationseintraege den Gate nicht bestehen.
- [x] Verifikation und Nachweis fuer Integrations-Teams festziehen (AC: 2)
  - [x] Pflichtvalidierung dokumentieren: `cd react-md3 && npm run quality:gate`.
  - [x] Migrationbeispiele auf Build-/Type-Sicherheit pruefen (keine toten oder nicht kompilierbaren Snippets).
  - [x] Fehlerklassifikation aus Story 3.1/3.2 (Setup-Fehler, Toolchain-Drift, API-Regression) fuer Migrationsfaelle wiederverwenden.

## Dev Notes

### Developer Context

- Story 3.3 schliesst in Epic 3 die Luecke zwischen API-Governance (Story 2.1) und Team-Integration (Story 3.1/3.2): Nutzer brauchen bei API-Aenderungen einen sofort nutzbaren Migrationspfad statt nur Metadaten.
- Story 2.1 hat Lifecycle, Pflichtmetadaten und Contract-Gates bereits etabliert; Story 3.3 soll daraus operationalisierte "Was-muss-ich-jetzt-aendern?"-Anleitungen machen.
- Story 3.1/3.2 haben CI-Matrix und Integrationsrezepte verankert; Story 3.3 muss dieselben Guardrails nutzen statt parallele Standards einzufuehren.

### Technical Requirements

- Migrationshinweise sind verpflichtend fuer API-Aenderungen mit Nutzerwirkung und muessen mindestens enthalten:
  - `alt -> neu` Mapping,
  - betroffene Exports/Pfade,
  - reproduzierbaren Verifikationsschritt.
- `react-md3/public-api.contract.json` bleibt die maschinenlesbare Quelle fuer Public Surface + Pflichtmetadaten (`affectedExports`, `changeType`, `riskLevel`, `migrationGuide`).
- `react-md3/CHANGELOG.md` bleibt die nutzerlesbare Quelle und muss Contract-Token + Pflichtmetadaten synchron abbilden.
- `react-md3/scripts/check-api-contract.mjs` ist der harte Gatekeeper; aendere Regeln nur minimal und rueckwaertskompatibel zur bestehenden Release-Traceability.
- Public API bleibt ausschliesslich Barrel-basiert (`src/index.ts`); Migrationsbeispiele duerfen keine Deep-Import-Workarounds propagieren.

### Architecture Compliance

- Package-API-first gilt unveraendert: keine Runtime-API, keine Datenbank, kein Scope-Drift in Infrastruktur.
- Doku-/Governance-Aenderungen bleiben im bestehenden Single-Package-Setup (`react-md3`) plus Root-README-Verlinkung.
- Bestehende Quality-Gates und CI-Matrix bleiben verbindlich; Story 3.3 erweitert Guidance, nicht die Support-Grenzen.
- Keine Shadow-Dokumentation: ein konsistenter Migrationspfad ueber README + Changelog + API-Contract.

### Library / Framework Requirements

- Projekt-Baselines laut `react-md3/package.json`: `react@^19.2.0`, `react-dom@^19.2.0`, `vite@^7.3.1`, `vitest@^4.0.18`, `typescript~5.9.3`.
- React-Versionierungsseite fuehrt die 19.2-Linie als aktuelle Dokumentationsbasis; Migrationsbeispiele muessen React-19-kompatibel sein.
- Node-Release-Status laut offizieller Node-Tabelle: 24 = Active LTS, 22 = Maintenance LTS; beide sind im aktuellen Supportfenster relevant.
- Changesets-Release-Feed zeigt stabile 2.29.x-Linie und separate `1.0.0-next`-Pre-Releases (Node >= 20); fuer stabile Pfade keine Pre-Release-Abhaengigkeit einfuehren.

### File Structure Requirements

- Voraussichtliche Haupt-Touchpoints:
  - `README.md` (Einstieg und Routing zum Migrationspfad)
  - `react-md3/README.md` (konkrete Migration-Playbooks und Codebeispiele)
  - `react-md3/CHANGELOG.md` (releasebezogene Migrationseintraege)
  - `react-md3/public-api.contract.json` (Pflichtmetadaten / Vertragssynchronitaet)
  - `react-md3/scripts/check-api-contract.mjs` (optional, falls Guardrail-Luecke geschlossen werden muss)
- Keine neuen, unverbundenen Doku-Orte einfuehren; bestehende Pfade erweitern und gegenseitig verlinken.

### Testing Requirements

- Mindestvalidierung vor Story-Abschluss:
  - `cd react-md3 && npm run quality:gate`
- Fuer Governance-/Script-Aenderungen zusaetzlich gezielt pruefen:
  - `cd react-md3 && npm run api:contract:check`
- Migrationsbeispiele muessen praktisch verifizierbar bleiben (keine pseudo-codeartigen Snippets ohne realen Importpfad).
- Story-3.1-Kompatibilitaetsregeln duerfen nicht regressieren; keine stille Erweiterung des Supportfensters.

### Previous Story Intelligence

- Story 3.2 Learning: Root-README und Paket-README muessen inhaltlich synchron bleiben; divergierende Doku fuehrt zu Integrationsfehlern.
- Story 3.2 Learning: Fehlerklassifikation (Setup-Fehler, Toolchain-Drift, API-Regression) hat sich als operative Triage bewaehrt und sollte fuer Migrationen wiederverwendet werden.
- Story 3.1 Learning: Matrix-Policy und lokale Reproduktion sind verbindliche Nachweise; Aussagen zu Supportversionen immer gegen Quellen verifizieren.
- Story 2.1 Learning: Contract-/Changelog-Synchronisation ist ein harter Gate; inkonsistente API-Traceability wird bewusst geblockt.

### Git Intelligence Summary

- Neueste Commits (`7e98f0a`, `58c728b`) zeigen ein klares Muster: Integrations-/Governance-Themen werden primär ueber Doku + Sprint-Status + reproduzierbare Gates umgesetzt.
- Komponenten-Commits in Epic 2 zeigen ebenfalls: API-aendernde Arbeit ist nur mit synchronen Updates an `public-api.contract.json` und `CHANGELOG.md` akzeptabel.
- Fuer Story 3.3 ist daher ein dokumentations- und governance-lastiger Change mit minimalem Risiko im Runtime-Code die erwartete, konsistente Richtung.

### Latest Tech Information

- React-Dokumentation listet 19.2 als aktuelle Hauptlinie und verweist fuer Aenderungen auf versionierte Releases/Upgrade-Guides.
- Node.js Release-Tabelle (offiziell) listet v24 als Active LTS und v22 als Maintenance LTS.
- Changesets-Release-Feed zeigt die laufende stabile 2.29.x-CLI-Linie; parallel existiert eine `1.0.0-next`-Linie mit Node-20-Mindestanforderung.
- Fuer diese Story ist kein Framework-Upgrade erforderlich; Fokus ist die Operationalisierung der vorhandenen Governance.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Story 2.1/3.1/3.2, aktuelle README-/Contract-/Changelog-/Script-Dateien, offizielle Versionsseiten.

### Project Structure Notes

- Alignment: Story 3.3 bleibt innerhalb der etablierten Struktur (`react-md3` + Root-Governance) und erweitert bestehende Dokumentationspfade.
- Guardrail: Migrationsempfehlungen muessen direkt an reale Release-Artefakte gekoppelt bleiben, damit sie nicht veralten oder widerspruechlich werden.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 3.3: Migrationspfad fuer API-Aenderungen operationalisieren]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 3: Integrationsfaehigkeit und Team-Workflow-Kompatibilitaet]
- [Source: _bmad-output/planning-artifacts/prd.md#API Contract & Lifecycle]
- [Source: _bmad-output/planning-artifacts/prd.md#Integration Requirements]
- [Source: _bmad-output/planning-artifacts/architecture.md#Core Architectural Decisions]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/implementation-artifacts/2-1-public-api-vertrag-und-deprecation-policy-etablieren.md]
- [Source: _bmad-output/implementation-artifacts/3-1-kompatibilitaetsmatrix-definieren-und-in-ci-absichern.md]
- [Source: _bmad-output/implementation-artifacts/3-2-integrationsrezepte-fuer-gaengige-team-setups-bereitstellen.md]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: README.md]
- [Source: react-md3/README.md]
- [Source: react-md3/package.json]
- [Source: react-md3/public-api.contract.json]
- [Source: react-md3/CHANGELOG.md]
- [Source: react-md3/scripts/check-api-contract.mjs]
- [Source: https://react.dev/versions]
- [Source: https://nodejs.org/en/about/previous-releases]
- [Source: https://github.com/changesets/changesets/releases]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`
- Validation: `cd react-md3 && npm run quality:gate`
- Contract Gate: `cd react-md3 && npm run api:contract:check`

### Story Completion Status

- Status set to `review`.
- Completion note: Story 3.3 migration path and governance guardrails are implemented and validated.

### Completion Notes List

- Root-README um den Einstieg "Welche Aenderung betrifft mich?" erweitert und auf das Paket-Playbook verlinkt.
- `react-md3/README.md` um Story-3.3-Migrationspfad mit Triggern, changeType->Migrationsaufwand-Mapping und zwei Playbooks (additiv + Breaking-Szenario) ergaenzt.
- `react-md3/CHANGELOG.md` um ein verpflichtendes Migrationsschema erweitert und aktuelle Release-Metadaten auf strukturierte migrationGuide-Form gebracht.
- `react-md3/public-api.contract.json` auf denselben migrationsGuide-Inhalt synchronisiert und Contract-Hash/Token aktualisiert.
- `react-md3/scripts/check-api-contract.mjs` erweitert: migrationGuide-Marker + changeType-Migrationsaufwand werden validiert, Changelog-Metadaten muessen exakt zum Contract passen.
- Validierung erfolgreich: `npm run api:contract:check` und `npm run quality:gate`.

### File List

- README.md
- react-md3/README.md
- react-md3/CHANGELOG.md
- react-md3/public-api.contract.json
- react-md3/scripts/check-api-contract.mjs
- _bmad-output/implementation-artifacts/3-3-migrationspfad-fuer-api-aenderungen-operationalisieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml

## Change Log

- 2026-02-27: Story 3.3 aus Sprint-Backlog uebernommen, Kontextdatei erstellt und Status auf `ready-for-dev` gesetzt.
- 2026-02-27: Story 3.3 umgesetzt, Migration-Playbooks und Governance-Guardrails synchronisiert, Status auf `review` gesetzt.
- 2026-02-27: Senior Developer Review abgeschlossen - keine Findings, Status auf `done` gesetzt, Sprint-Status synchronisiert.

## Senior Developer Review (AI)

### Outcome

- **Approve** - keine High/Medium/Low Findings.

### Validation Evidence

- Git-vs-Story-Abgleich: File List entspricht den tatsaechlichen Aenderungen (`README.md`, `react-md3/README.md`, `react-md3/CHANGELOG.md`, `react-md3/public-api.contract.json`, `react-md3/scripts/check-api-contract.mjs`, Story-Datei, `sprint-status.yaml`).
- Acceptance Criteria 1-2 sind umgesetzt: Changelog/Contract transportieren konsistente Migrationsmetadaten inkl. `Alt -> Neu`; Paket-README enthaelt reproduzierbare Vorher/Nachher-Beispiele und Verifikationspfad.
- Re-Validierung erfolgreich: `cd react-md3 && npm run quality:gate`.

### Follow-ups

- Keine.
