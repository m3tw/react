# Story 2.1: Public-API-Vertrag und Deprecation-Policy etablieren

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a Library-Maintainer,
I want einen klar versionierten Public-API-Vertrag mit Deprecation-Regeln,
so that API-Aenderungen vorhersehbar und sicher fuer Nutzer ausgerollt werden.

## Acceptance Criteria

1. **Given** die aktuellen und geplanten Public Exports  
   **When** der API-Vertrag und die Deprecation-Policy festgelegt werden  
   **Then** sind Exportgrenzen, Versionierungsregeln und Breaking-Change-Kommunikation eindeutig dokumentiert.
2. **And** API-Aenderungen koennen pro Release nachvollzogen werden (FR9, FR10, FR12).

## Tasks / Subtasks

- [x] Public API Surface explizit definieren und dokumentieren (AC: 1)
  - [x] Alle aktuell oeffentlichen Exports ueber `react-md3/src/index.ts` und `react-md3/src/components/index.ts` inventarisieren.
  - [x] Verbindliche Exportgrenzen dokumentieren (nur Barrel-Entry, keine Deep-Imports als oeffentliche API).
  - [x] `react-md3/package.json` auf explizite Entry-/Exports-Definition pruefen und bei Bedarf auf klaren Public Surface ausrichten.
- [x] Deprecation-Policy mit SemVer-Regeln festlegen (AC: 1, 2)
  - [x] Lifecycle definieren: `active -> deprecated -> removed` inkl. Mindestvorlauf und Kommunikationskanal.
  - [x] SemVer-Mapping dokumentieren (deprecations als minor, removals/breaking changes als major).
  - [x] Verpflichtende Migrationshinweise fuer jede API-Aenderung mit Nutzerwirkung festschreiben.
- [x] Release-Nachvollziehbarkeit fuer API-Aenderungen operationalisieren (AC: 2)
  - [x] Changeset-/Changelog-Prozess fuer API-Aenderungen verbindlich beschreiben.
  - [x] Pro API-Aenderung Pflichtmetadaten definieren: betroffene Exports, Change-Typ, Migration, Risiko.
  - [x] README-/Doku-Quellen auf eine zentrale Wahrheit fuer Public API und Deprecations konsolidieren.
- [x] Contract-Gates und Verifikation absichern (AC: 1, 2)
  - [x] Contract-Checks fuer Public API in bestehende Quality Gates integrieren (mind. lint/test/build + API-Contract-Check).
  - [x] Sicherstellen, dass API-Kontrakt-Aenderungen ohne Changelog/Migration den Gate nicht passieren.
  - [x] Nachweisbare Verifikationsschritte fuer Maintainer dokumentieren (Release-Check vor Stable).

## Dev Notes

### Developer Context

- Story 2.1 ist die erste Story in Epic 2 und setzt den Governance-Rahmen fuer alle nachfolgenden Komponenten-Slices (2.2-2.5).
- Fokus ist API-Lifecycle und Release-Disziplin, nicht Komponenten-Neubau.
- Bestehende Guardrails aus Epic 1 bleiben verbindlich: Public API ueber Barrel, keine Deep-Import-Freigaben, reproduzierbare Quality Gates.

### Technical Requirements

- Public API MUSS explizit und versionierbar beschrieben sein (Exports, Stabilitaetszusagen, Deprecation-Status je API-Element).
- Jede API-Aenderung MUSS einem klaren Change-Typ zugeordnet werden: patch/minor/major nach SemVer.
- Deprecated APIs MUESSEN weiter funktionieren bis zur dokumentierten Removal-Version (keine stillen Hard-Breaks).
- Breaking Changes MUESSEN Migration Guidance enthalten (mindestens "alt -> neu", betroffene Pfade, Verifikationsschritt).
- Release-Artefakte fuer API-Aenderungen MUESSEN nachvollziehbar bleiben (Changesets/Changelog als Pflicht).

### Architecture Compliance

- Package-API-first bleibt verbindlich: oeffentliche API nur ueber `src/index.ts` (und aggregierte Barrel-Ebenen), keine Deep-Import-Vertraege.
- Keine Runtime REST/GraphQL/API und keine Runtime-Datenbank im Rahmen dieser Story.
- Struktur im aktuellen `react-md3`-Layout halten; keine vorgezogene Monorepo-Reorganisation nur fuer diese Story.
- CI-Governance aus Architektur gilt weiterhin: Lint + Test + Build als Mindestgates, Erweiterung um API-Contract-Pruefung.

### Library / Framework Requirements

- Baseline gemaess Architektur: `react@^19.2.0`, `typescript~5.9.3`, `vite@^7.3.1`, `vitest@^4.0.18`.
- Node-Baseline fuer Team- und CI-Reproduzierbarkeit: 24.x LTS.
- Bei Einfuehrung/Erweiterung von Release-Tooling Changesets-Linie beachten (`@changesets/cli` 2.29.x stabil, 1.0.0-next mit Node >=20 Pre-Release).
- Keine Pre-Release-Versionen (beta/next) fuer Kern-Governance in Stable-Pfaden ohne explizite ADR-Entscheidung.

### File Structure Requirements

- Primaere Touchpoints fuer diese Story:
  - `react-md3/package.json` (Public Entry/Exports, Versionierungs-/Release-Skripte)
  - `react-md3/src/index.ts` und `react-md3/src/components/index.ts` (Public API Surface)
  - `README.md` und `react-md3/README.md` (oeffentlich sichtbare API-/Deprecation-Regeln)
  - Optional: `react-md3/CHANGELOG.md` oder `.changeset/*` fuer API-Change-Nachweise
- Keine neuen parallelen API-Wahrheiten schaffen; ein klarer Hauptpfad fuer API-Vertrag + Deprecation-Policy.

### Testing Requirements

- Verbindliche Gates im Paket `react-md3`: `npm run lint`, `npm run test`, `npm run build`.
- API-Contract-Check muss reproduzierbar sein (z. B. Export-Snapshot oder statischer Contract-Test gegen Public Barrel).
- Deprecation-Pfade muessen mindestens auf Dokumentations- und Contract-Ebene testbar sein (deprecated markiert, nicht still entfernt).
- Release-Traceability fuer API-Aenderungen muss vor Freigabe pruefbar sein (Changeset/Changelog/Migrationshinweis vorhanden).

### Latest Tech Information

- SemVer-Spezifikation fordert eine explizite Public API und klare Versionierungsregeln; Deprecation-Markierungen fallen unter minor-Erhoehungen, Breaking Removals unter major.
- Node.js empfiehlt fuer moderne Packages das `exports`-Feld in `package.json`; es kapselt den Public Surface und verhindert unbeabsichtigte Entry-Points.
- Changesets-Releases zeigen die stabile CLI-Linie 2.29.x; parallel existiert eine 1.0.0-next Linie mit Mindestanforderung Node >=20.
- React-Dokumentation fuehrt 19.2 als aktuelle Hauptlinie; bestehender 19.2-Track bleibt fuer diese Story passend.
- Vite-Releases weisen 7.3 als aktive Fix-Linie aus; damit bleibt die aktuelle Tooling-Baseline konsistent.
- TypeScript-Releases zeigen 5.9.3 als stabile Linie bei parallel verfuegbarer 6.0 Beta; fuer Story-Governance auf stabiler 5.9-Linie bleiben.

### Project Context Reference

- `**/project-context.md` wurde im Repository nicht gefunden.
- Verwendete Kontextquellen: Epics, PRD, Architektur, Sprint-Status, bestehende Story-Artefakte und aktuelle Tech-Referenzen.

### Project Structure Notes

- Alignment: Story bleibt im aktuellen Single-Package-Layout (`react-md3`) und setzt auf bestehende Barrel-Struktur.
- Variance: Zielarchitektur beschreibt langfristig ein Workspace/Monorepo-Modell; diese Story etabliert den API-Governance-Rahmen bereits jetzt im aktuellen Layout.
- Guardrail: Keine Erweiterung des oeffentlichen Surface ausserhalb definierter Barrel-Exports ohne explizite Contract-Anpassung.

### References

- [Source: _bmad-output/planning-artifacts/epics.md#Story 2.1: Public-API-Vertrag und Deprecation-Policy etablieren]
- [Source: _bmad-output/planning-artifacts/epics.md#Epic 2: Vollstaendige M3-Komponentenabdeckung mit stabiler API]
- [Source: _bmad-output/planning-artifacts/prd.md#API Contract & Lifecycle]
- [Source: _bmad-output/planning-artifacts/architecture.md#API & Communication Patterns]
- [Source: _bmad-output/planning-artifacts/architecture.md#Implementation Patterns & Consistency Rules]
- [Source: _bmad-output/planning-artifacts/architecture.md#Project Structure & Boundaries]
- [Source: _bmad-output/implementation-artifacts/sprint-status.yaml]
- [Source: react-md3/package.json]
- [Source: react-md3/src/index.ts]
- [Source: react-md3/src/components/index.ts]
- [Source: https://semver.org/]
- [Source: https://nodejs.org/api/packages.html#exports]
- [Source: https://github.com/changesets/changesets/releases]
- [Source: https://react.dev/versions]
- [Source: https://vite.dev/releases]
- [Source: https://github.com/microsoft/TypeScript/releases]

## Dev Agent Record

### Agent Model Used

GPT-5.3-Codex (gpt-5.3-codex)

### Debug Log References

- Workflow Engine: `_bmad/core/tasks/workflow.xml`
- Skill Workflow: `_bmad/bmm/workflows/4-implementation/dev-story/workflow.yaml`
- Story Instructions: `_bmad/bmm/workflows/4-implementation/dev-story/instructions.xml`
- Sprint Tracking: `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Story Completion Status

- Status set to `done`.
- Completion note: Public-API-Vertrag, Deprecation-Policy und verifizierbare Contract-Gates wurden umgesetzt.

### Completion Notes List

- Public API als verbindlicher Barrel-Vertrag in `react-md3/package.json`, `react-md3/README.md` und `react-md3/public-api.contract.json` konsolidiert.
- Deprecation-Lifecycle (`active -> deprecated -> removed`), SemVer-Mapping und verpflichtende Migration Guidance als Governance-Regeln dokumentiert.
- Reproduzierbarer API-Contract-Gate via `npm run api:contract:check` und `npm run quality:gate` implementiert, inkl. Changelog-Token-Pruefung.
- Validierung erfolgreich: `npm run lint`, `npm run test`, `npm run build`, `npm run api:contract:check` in `react-md3`.

### File List

- _bmad-output/implementation-artifacts/2-1-public-api-vertrag-und-deprecation-policy-etablieren.md
- _bmad-output/implementation-artifacts/sprint-status.yaml
- README.md
- react-md3/CHANGELOG.md
- react-md3/README.md
- react-md3/package.json
- react-md3/public-api.contract.json
- react-md3/scripts/check-api-contract.mjs
- react-md3/src/index.test.ts

## Change Log

- 2026-02-27: Story 2.1 implementiert (Public-API-Vertrag dokumentiert, Deprecation-Policy festgelegt, API-Contract-Gates + Release-Traceability in Paketdokumentation und Checks verankert, Quality-Gates erfolgreich ausgefuehrt).
- 2026-02-27: Senior Developer Review (AI) im YOLO-Modus abgeschlossen; identifizierte HIGH/MEDIUM Findings im API-Contract-Gate behoben, Story auf `done` gesetzt.

## Senior Developer Review (AI)

### Reviewer

- Darko (GPT-5.3-Codex via bmad-bmm-code-review)

### Findings (behoben)

- [HIGH] `contractHash` basierte nur auf Exportnamen; Governance-Aenderungen (Deprecation-/Traceability-Regeln) konnten ohne Hash-/Changelog-Update durchrutschen (`react-md3/scripts/check-api-contract.mjs`).
- [MEDIUM] Pflichtstruktur der Deprecation-Policy wurde nicht validiert (Lifecycle, Mindestvorlauf, SemVer-Mapping, Migrationspflicht), wodurch unvollstaendige Vertragsdaten den Gate passieren konnten (`react-md3/scripts/check-api-contract.mjs`).
- [MEDIUM] Public-Surface-Grenzen zwischen `public-api.contract.json` und `package.json`-Exports wurden nicht gegengeprueft; Subpath-Exports koennten trotz `allowDeepImports=false` unbemerkt eingefuehrt werden (`react-md3/scripts/check-api-contract.mjs`).

### Fixes

- API-Contract-Check um Governance-Validierung erweitert (Deprecation-Policy + SemVer + Migration Guidance + package.json Exportgrenzen).
- Hash-Bildung auf einen stabil serialisierten Governance-Snapshot umgestellt (ohne `contractHash`/`changelogToken`-Zirkularitaet).
- `react-md3/public-api.contract.json` und `react-md3/CHANGELOG.md` auf neuen Contract-Hash synchronisiert.

### Outcome

- Ergebnis: **Approve**
- HIGH/MEDIUM Findings offen: **0**
