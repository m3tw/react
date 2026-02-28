# react

## Story 1.1 Startpunkt

Diese Basis implementiert den ersten produktiven Setup-Schritt aus Story 1.1:
Vite + React + TypeScript ist lauffaehig, inklusive einer ersten renderbaren M3-Referenzkomponente.

## Story 1.2 Verifizierte Installationspfade (npm/pnpm/yarn/bun)

### Support- und Prerequisite-Matrix

| Bereich | Verbindliche Baseline | Verifiziert mit |
| --- | --- | --- |
| Node.js | 24.x LTS | 24.13.0 |
| npm | 11.x | 11.10.1 |
| pnpm | 10.x | 10.28.2 |
| Yarn | 4.x | 4.6.0 |
| Bun | 1.3.x | 1.3.9 |

### Paketquelle und Paketname

- Exakter Paketname aus Manifest: `react-md3` (`react-md3/package.json`).
- Paketquelle in dieser Story: lokales Repository (`./react-md3`), keine Registry-Verteilung.
- Import-Sanity wird gegen den oeffentlichen Einstieg `src/index.ts` validiert (Barrel-Entry).

### Reproduzierbare Installationspfade pro Manager

> Empfehlung: pro Working Copy nur **einen** Package-Manager verwenden.
> Fuer pnpm/yarn zuerst Corepack aktivieren: `corepack enable`.

#### npm

```bash
cd react-md3
npm install
npm run build
```

#### pnpm

```bash
cd react-md3
pnpm install
pnpm run build
```

#### yarn

```bash
cd react-md3
yarn install
yarn build
```

#### bun

```bash
cd react-md3
bun install
bun run build
```

**Verifikationsziel pro Pfad:** erfolgreicher Install-Lauf plus erfolgreicher Build-Lauf mit Import ueber `src/index.ts`.

### Story 1.4 Troubleshooting-Basis (Schema: Symptom -> Diagnose -> Fix -> Verifikation)

#### Package-Manager-Konflikte

- **Symptom:** `pnpm` oder `yarn` wird nicht gefunden.
  - **Diagnose:** `pnpm --version` oder `yarn --version` liefert "command not found".
  - **Fix:** `corepack enable` ausfuehren und Version erneut pruefen.
  - **Verifikation:** Version wird ausgegeben (pnpm 10.x / Yarn 4.x), danach `npm run build` in `react-md3` erfolgreich.
- **Symptom:** Install-Lauf scheitert nach Manager-Wechsel.
  - **Diagnose:** Mehrere Lockfiles gleichzeitig (`package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, `bun.lockb`) oder veraltetes `node_modules`.
  - **Fix:** Guardrail "ein Manager pro Working Copy" anwenden, unpassende Lockfiles und `node_modules` entfernen und mit genau einem Manager neu installieren.
  - **Verifikation:** `npm install` (oder entsprechender Manager) laeuft ohne Konflikt und `npm run build` ist erfolgreich.

#### Build-Konflikte

- **Symptom:** Build bricht mit Engine-/Syntax-Fehlern ab.
  - **Diagnose:** `node --version` ist nicht auf 24.x LTS.
  - **Fix:** Node auf 24.x LTS aktualisieren, dann Dependencies neu installieren.
  - **Verifikation:** `npm run build` in `react-md3` laeuft ohne Engine-Fehler durch.
- **Symptom:** Build/Typecheck meldet Import-/Entry-Probleme.
  - **Diagnose:** Deep-Import statt Public Barrel (`src/index.ts`) wird verwendet.
  - **Fix:** Importe auf Public API umstellen (z. B. `import { M3ReferenceCard } from './index'`).
  - **Verifikation:** `npm run test` und `npm run build` laufen erfolgreich.
- **Symptom:** Build scheitert wegen fehlender Abhaengigkeiten.
  - **Diagnose:** `npm install` oder `npm ls` zeigt fehlende Module.
  - **Fix:** Fehlende Dependencies sauber installieren und danach erneut bauen.
  - **Verifikation:** `npm run build` erzeugt `dist/` ohne Fehler.

#### Theming-/M3-Integrationskonflikte

- **Symptom:** `M3ReferenceCard` ist ungestylt oder nicht sichtbar.
  - **Diagnose:** `src/App.tsx` auf `import './App.css'` und Import ueber `./index` pruefen; Dev-Server-Ausgabe auf Runtime-Fehler pruefen.
  - **Fix:** Fehlende Imports wiederherstellen und Klassen (`m3-reference-card`) unveraendert verwenden.
  - **Verifikation:** `npm run dev` starten und im Browser Badge "Story 1.3 Getting Started", Headline und sichtbare `M3ReferenceCard` bestaetigen.
- **Symptom:** Farben/Kontrast wirken im Dark-Mode inkonsistent.
  - **Diagnose:** `src/index.css` und `src/App.css` auf `@media (prefers-color-scheme: dark)` pruefen.
  - **Fix:** Vorhandene Dark-Mode-Regeln nicht entfernen; bei Abweichung auf den aktuellen Stand angleichen.
  - **Verifikation:** Im Dark-Mode bleibt die Karte lesbar (`h2` und `p` mit ausreichendem Kontrast).

## Story 1.3 Getting-Started-Flow (<= 5 Minuten)

Schnellpfad fuer Erstnutzer von frischem Setup bis zur ersten produktiven Komponente:

1. Voraussetzungen pruefen (Node 24.x LTS, ein Package-Manager, Corepack bei pnpm/yarn aktiv).
2. `react-md3` installieren (siehe Story-1.2-Pfade oben fuer npm/pnpm/yarn/bun).
3. Dev-Server starten:

```bash
cd react-md3
npm run dev
```

4. Im Browser die Starter-Seite pruefen (standardmaessig `http://localhost:5173`):
   - Story-Badge "Story 1.3 Getting Started"
   - sichtbare produktive Komponente `M3ReferenceCard`
5. API-Hinweise und Standardbeispiel direkt im Paket-Guide nutzen:
   - `react-md3/README.md` (Importpfad ueber Public Barrel `src/index.ts`, Props und Beispielcode)

## Story 2.1 Public API Governance

- Verbindliche Public-API-Dokumentation liegt zentral in `react-md3/README.md`.
- Maschinenlesbarer API-Vertrag liegt in `react-md3/public-api.contract.json`.
- Release-Traceability fuer API-Aenderungen liegt in `react-md3/CHANGELOG.md` (inkl. `api-contract-hash` Token).
- Public API wird ausschliesslich ueber `react-md3/src/index.ts` konsumiert (keine Deep-Import-Vertraege).

## Story 3.1 Kompatibilitaetsmatrix und CI-Absicherung

### Verbindliche Matrix (supported)

| Node.js | npm | pnpm | yarn | bun | CI-Status |
| --- | --- | --- | --- | --- | --- |
| 22.x LTS | ja | ja | ja | ja | supported |
| 24.x (Current) | ja | ja | ja | ja | supported |

### Explizit nicht unterstuetzte Kombinationen

| Kombination | Matrix-Handling | Grund |
| --- | --- | --- |
| Node 20.x + npm/pnpm/yarn/bun | `exclude` in `.github/workflows/compatibility-matrix.yml` | Nicht Teil des aktuellen Support-Fensters (Story-3.1-Policy = 22.x/24.x LTS). |
| Node < 20 + beliebiger Manager | nicht in Matrix | Toolchain-Basis verletzt (Vitest benoetigt mindestens Node 20). |

### Lokale Reproduktion der CI-Matrix

> Node-Version jeweils vorher mit deinem Versionsmanager setzen (z. B. `nvm use 22` oder `nvm use 24`).

```bash
# Node 22
cd react-md3
npm ci && npm run quality:gate
corepack enable && corepack prepare pnpm@10.28.2 --activate && pnpm install --frozen-lockfile=false && pnpm run quality:gate
corepack enable && corepack prepare yarn@4.6.0 --activate && yarn install --mode=skip-build && yarn run quality:gate
bun install && bun run quality:gate

# Node 24
cd react-md3
npm ci && npm run quality:gate
corepack enable && corepack prepare pnpm@10.28.2 --activate && pnpm install --frozen-lockfile=false && pnpm run quality:gate
corepack enable && corepack prepare yarn@4.6.0 --activate && yarn install --mode=skip-build && yarn run quality:gate
bun install && bun run quality:gate
```

### Interpretationsleitfaden fuer Matrix-Fehler

- **Setup-Fehler:** Install-Step scheitert (fehlender Manager/inkonsistente Toolchain) -> zuerst Manager-Version, Corepack-Setup und Install-Command pruefen.
- **Toolchain-Drift:** `lint`, `test` oder `build` schlagen fehl -> Node- und Paketmanager-Versionen gegen die Matrix-Baselines abgleichen.
- **API-Regression:** `npm run api:contract:check` faellt -> Public API + `public-api.contract.json` + `CHANGELOG.md` synchronisieren.
- **Governance-Regel:** Bei API-/Tooling-Aenderungen Matrix-Definition, Changelog und API-Contract-Checks immer gemeinsam aktualisieren.

## Story 3.2 Integrationsrezepte fuer gaengige Team-Setups

Verbindliches Rezeptformat fuer alle Team-Setups: **Voraussetzungen -> Schritte -> Verifikation -> Troubleshooting**.

### Rezept A: Bestehende Vite-React-App

- **Voraussetzungen**
  - Support-Guardrail aus Story 3.1: nur Node 22.x/24.x plus `npm|pnpm|yarn|bun`.
  - Pro Working Copy genau ein Package-Manager; fuer `pnpm`/`yarn` vorher `corepack enable`.
  - Integration nur ueber Public API (`react-md3/src/index.ts`), keine Deep-Imports.
- **Schritte**
  1. Paket in der Ziel-App mit dem aktiven Package-Manager integrieren und Imports ueber den Public Barrel setzen.
  2. Build und Theming in der Ziel-App pruefen (Komponente sichtbar, M3-Styling vorhanden, kein ungestylter Fallback).
  3. In diesem Repository die Guardrail-Verifikation ausfuehren: `cd react-md3 && npm run quality:gate`.
- **Verifikation**
  - Integration laeuft reproduzierbar: Install ok, Build ok, Theming sichtbar korrekt.
  - Quality-Gates sind gruen (`lint`, `test`, `build`, `api:contract:check` via `quality:gate`).
- **Troubleshooting**
  - Setup-Fehler / Toolchain-Drift / API-Regression nach obiger Fehlerklassifikation einordnen.
  - Fuer konkrete Fixes die Troubleshooting-Abschnitte in diesem README (Story 1.4) und in `react-md3/README.md` verwenden.

### Rezept B: Vorhandene React-App mit alternativer Toolchain

- **Voraussetzungen**
  - Gleiche Support-Guardrails wie Rezept A (Node 22.x/24.x, Manager-Matrix aus Story 3.1).
  - Toolchain muss ESM-Imports ueber den Public Entry unterstuetzen.
- **Schritte**
  1. Public-API-Import (`src/index.ts`) als einzige Integrationskante festlegen; keine projektspezifischen Deep-Import-Abkuerzungen.
  2. Bestehende Build-/Test-Pipeline der Ziel-App ausfuehren und danach Library-Gates gegenpruefen: `cd react-md3 && npm run quality:gate`.
  3. Theming-Check mit realem UI-Zustand (Surface/Texte/Interaktionen) in Light- und Dark-Mode durchfuehren.
- **Verifikation**
  - Ziel-Toolchain baut ohne Sonderpfade.
  - Theming und Komponentenverhalten sind konsistent mit den Referenzbeispielen.
- **Troubleshooting**
  - Toolchain-spezifische Build-Probleme zuerst als Toolchain-Drift behandeln, danach gegen Matrix- und Troubleshooting-Regeln abgleichen.

### Rezept C: Team-Workflow mit CI-Reproduktion

- **Voraussetzungen**
  - CI orientiert sich an `.github/workflows/compatibility-matrix.yml` und `.github/workflows/reference-integration.yml`.
  - Supportfenster bleibt explizit: Node 22/24 supported, Node 20 ausgeschlossen.
- **Schritte**
  1. Matrix-Zelle lokal mit dem jeweiligen Manager reproduzieren (siehe Story-3.1-Abschnitt "Lokale Reproduktion der CI-Matrix").
  2. In jeder relevanten Zelle `quality:gate` ausfuehren.
  3. Referenzintegration lokal ausfuehren: `cd react-md3/reference-integration && npm install && npm run ci:smoke`.
  4. Ergebnis je Fehlerklasse dokumentieren (Setup-Fehler, Toolchain-Drift, API-Regression) und passenden Recovery-Pfad anwenden.
- **Verifikation**
  - Mindestens ein reproduzierter Teamlauf mit `cd react-md3 && npm run quality:gate` ist dokumentiert.
  - Referenzlauf (`install -> build -> test`) im Referenzprojekt ist reproduzierbar bestaetigt.
  - Fehlerklassifikation und Gegenmassnahmen sind fuer das Team nachvollziehbar.
- **Troubleshooting**
  - Setup-/Build-/Theming-Probleme ueber bestehende Troubleshooting-Abschnitte eskalieren, ohne parallele Shadow-Doku aufzubauen.

## Story 3.3 Migrationspfad fuer API-Aenderungen

### Welche Aenderung betrifft mich?

1. Oeffne zuerst `react-md3/CHANGELOG.md` und identifiziere den neuesten Eintrag.
2. Vergleiche `affectedExports` mit deinen verwendeten Public-API-Imports.
3. Wechsle danach direkt in das passende Playbook unter `react-md3/README.md`:
   - [Story 3.3 Migrationspfad fuer API-Aenderungen](react-md3/README.md#675-story-33-migrationspfad-fuer-api-aenderungen)

**Pflicht-Nachweis fuer jede Migration:** `cd react-md3 && npm run quality:gate`

## Story 3.4 Referenzintegration als CI-Nachweis

### Referenzprojekt (Public API only)

- Zielpfad: `react-md3/reference-integration`
- Die Referenz-App importiert ausschliesslich aus `react-md3` (kein Deep-Import auf `src/components/*`).
- Smoke-Pfad lokal:

```bash
cd react-md3/reference-integration
npm install
npm run ci:smoke
```

### CI-Workflow und Supportfenster

- Workflow: `.github/workflows/reference-integration.yml`
- Trigger: `pull_request`, `push`, optional `workflow_dispatch`
- Node-Support bleibt Story-3.1-konform:
  - supported: 22.x, 24.x
  - excluded: 20.x

### Fehlerklassifikation und Diagnose-Signale

- `setup-fehler` -> Install-Step
- `toolchain-drift` -> Build-Step
- `api-regression` -> Test-Step
- CI laedt pro Matrix-Zelle Diagnose-Logs als Artefakt hoch (`reference-integration-logs-node-<version>-<run>`).

### Bewusst provoziertes Fehlerbild (lokale Diagnoseprobe)

```bash
cd react-md3/reference-integration
REFERENCE_FAIL_MODE=api-regression npm run ci:smoke
```

Erwartung: Der Lauf bricht mit einem expliziten `[api-regression]`-Signal ab.

### Guardrail-Kette fuer Teams

1. Referenzintegration nachweisen (`npm run ci:smoke`).
2. Library-Guardrail pruefen (`cd react-md3 && npm run quality:gate`).
3. Bei API-Regression zusaetzlich Contract/Changelog synchronisieren (Story 3.3 Governance-Pfad).

## Story 4.1 Release-Checkliste und harte Quality Gates

- Verbindliche operative Checkliste (Single Source of Truth): [`react-md3/README.md` Abschnitt 6.10](react-md3/README.md#610-story-41-release-checkliste-und-harte-quality-gates).
- Harte Regel fuer Stable-Releases: fehlende oder rote Gate-Evidenz => **No-Go**.
- Pflicht-Evidenz basiert auf bestehenden Guardrails (`quality:gate`, Kompatibilitaetsmatrix Node 22/24, Referenzintegration, API-Contract-Governance) und nutzt die gleichen Fehlerklassen (`setup-fehler`, `toolchain-drift`, `api-regression`).
- Story 4.2 setzt die technische Durchsetzung ueber `.github/workflows/release-gate.yml` um (orchestrierte Pflicht-Gates + Evidence-Pack + automatisches Go/No-Go).
- Pflegeprozess: pro Release-Kandidat aktualisieren; finale Freigabe wird ueber ein standardisiertes Go/No-Go-Protokoll dokumentiert.

## Story 4.3 Go/No-Go-Entscheidungsprozess fuer Phasenwechsel

- Verbindlicher Phasenwechselprozess (Single Source of Truth): [`react-md3/README.md` Abschnitt 6.11](react-md3/README.md#611-story-43-go-no-go-entscheidungsprozess-fuer-phasenwechsel).
- Pflichtinput fuer jede Phasenentscheidung: Story-4.1-Checkliste (Abschnitt 6.10), Story-4.2-Evidence-Pack (`release-evidence/gates.json`, `no-go-reasons.txt`, `evidence-pack.md`) plus Metrik-/Risikosnapshot.
- Harte Blocker bleiben unveraendert (`setup-fehler`, `toolchain-drift`, `api-regression`, fehlende Pflicht-Evidenz) und erzwingen `no-go`.
- Entscheidungsstatus ist konsistent als `go`/`no-go` dokumentiert; kritische Entscheidungen erfordern 2-Augen-Freigabe ohne Self-Approval.

## Story 5.1 Support-Triage und Known-Issues-Katalog

- Verbindlicher operativer Prozess (Single Source of Truth): [`react-md3/README.md` Abschnitt 6.12](react-md3/README.md#612-story-51-support-triage-und-known-issues-katalog).
- Problemklassen bleiben repo-weit konsistent: `setup-fehler`, `toolchain-drift`, `api-regression`; Priorisierung erfolgt ueber P1-P4 mit klaren Reaktionszeiten.
- Strukturierter Intake ist ueber `.github/ISSUE_TEMPLATE/support-triage.yml` vorbereitet; Routing erfolgt ueber standardisierte Labels (`triage:*`, `priority:*`, `status:*`).
- Jeder klassifizierte Fall muss auf einen kanonischen Known-Issue-Eintrag verweisen (oder einen neuen Eintrag anlegen), um Dubletten-Wissen zu vermeiden.
- Konsistenznachweis fuer den Prozess: 3 reprasentative Triage-Faelle plus `cd react-md3 && npm run quality:gate`.

## Story 5.2 Recovery-Playbooks fuer haeufige Fehlerszenarien

- Operative Recovery-Playbooks (Single Source of Truth): [`react-md3/README.md` Abschnitt 6.13](react-md3/README.md#613-story-52-recovery-playbooks-fuer-haeufige-fehlerszenarien).
- Verbindlicher Playbook-Standard pro Fall: Trigger, Severity, Diagnose, Sofortmassnahme, Verifikation, Rollback/Eskalation, Abschlussupdate.
- Intake -> Triage -> Recovery -> Verifikation ist durchgaengig dokumentiert; `status:resolved` ist nur nach erfolgreicher Verifikation und dokumentiertem Ergebnis zulaessig.
- Playbooks bleiben direkt auf Story-5.1-Klassen und kanonische Known-Issue-IDs ausgerichtet (`setup-fehler`, `toolchain-drift`, `api-regression`; `KI-001` bis `KI-003`).
- Baseline-Guardrail und Recovery-Drills: `cd react-md3 && npm run quality:gate` plus drei reproduzierbare Dry-Run-Szenarien (je Klasse ein Drill).

## Story 5.3 KPI-Tracking fuer Adoption und Time-to-Value etablieren

- Operatives KPI-Set (Single Source of Truth): [`react-md3/README.md` Abschnitt 6.14](react-md3/README.md#614-story-53-kpi-tracking-fuer-adoption-und-time-to-value-etablieren).
- Verbindlich definierte Kernmetriken fuer FR28-FR31: aktive Nutzung, Time-to-Value, Setup-Erfolg und Weiterverwendung (inkl. Formel, Messfenster, Owner, Baseline/Zielwert, Eskalationsschwelle).
- Tracking bleibt dokumentations-/prozessbasiert und nutzt nur bestehende Datenquellen: GitHub-Traffic, Issue-/Label-Signale aus Support-Triage sowie Guardrail-/Release-Evidenz.
- Vergleichbarkeit ueber Releases ist fixiert (UTC-Snapshots, stabile KPI-Versionierung, explizite Definition-Change-Policy ohne stille Defaults).
- KPI-Abweichungen werden ueber einen klaren Entscheidungspfad in priorisierte Produktmassnahmen ueberfuehrt (Beobachtung -> Analyse -> Massnahme -> Rueckmessung) und direkt als Input fuer Story 5.4 genutzt.

## Initialisierung und Verifikation (Story 1.1)

```bash
npm create vite@latest react-md3 -- --template react-ts
cd react-md3
npm install
npm run dev
```

Verifikation:

1. Dev-Server startet ohne Setup-Blocker.
2. Lokale URL (standardmaessig `http://localhost:5173`) ist erreichbar.
3. Die Seite zeigt die "M3 Referenzkomponente" sichtbar an.

## Kernskripte

```bash
cd react-md3
npm run dev
npm run build
npm run test
npm run lint
```

## Architektur-Konformitaet fuer spaetere Monorepo-Einbettung

- Komponenten liegen unter `src/components/*`.
- Oeffentliche API der UI-Komponenten laeuft ueber `src/index.ts` (Barrel-Entry, kein Deep-Import noetig).
- Struktur bleibt migrationsarm, damit ein spaeterer Move nach `packages/ui` ohne grosse Umbrueche moeglich ist.
