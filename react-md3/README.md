# react-md3 Getting-Started (<= 5 Minuten)

Kompakter Einstieg vom frischen Setup bis zu produktiven Komponenten (`Snackbar`, `Dialog`, `AlertDialog` plus bestehende Basis-Komponenten).

## 1) Voraussetzungen

- Node.js 22.x LTS oder 24.x (Current)
- npm 11.x, pnpm 10.x, Yarn 4.x oder Bun 1.3.x
- Pro Working Copy genau einen Package-Manager verwenden
- Fuer pnpm/yarn vorab: `corepack enable`

## 2) Setup und Start

### npm

```bash
cd react-md3
npm install
npm run dev
```

### pnpm

```bash
cd react-md3
pnpm install
pnpm dev
```

### yarn

```bash
cd react-md3
yarn install
yarn dev
```

### bun

```bash
cd react-md3
bun install
bun run dev
```

## 3) Verifikation des 5-Minuten-Pfads

Oeffne die lokale URL (standardmaessig `http://localhost:5173`) und pruefe:

1. Story-Badge: `Story 2.5 Feedback/Overlay`
2. Headline: `M3 Feedback & Overlay sind bereit`
3. Sichtbare Komponenten inkl. Varianten: `Snackbar` (Success/Warning/Error), `Dialog`, `AlertDialog`

Damit ist mindestens eine produktive M3-Komponente lauffaehig integriert.

## 4) API-Hinweise + Standardbeispiel

Die Komponenten werden ueber den Public Barrel genutzt:

- `src/App.tsx` importiert aus `./index`
- `src/index.ts` exportiert aus `./components`
- `src/components/index.ts` exportiert alle freigegebenen UI-Bausteine inkl. Feedback-/Overlay-Slice
- Keine Deep-Imports verwenden

### Importpfad in `src/App.tsx`

```tsx
import {
  AlertDialog,
  Dialog,
  NavigationDrawer,
  NavigationRail,
  Snackbar,
  Surface,
  TopAppBar,
} from './index'
```

### Standardbeispiele

```tsx
<Dialog
  description="Aenderungen werden sofort veroeffentlicht."
  onOpenChange={setDialogOpen}
  open={dialogOpen}
  title="Aenderung speichern?"
/>

<AlertDialog
  cancelLabel="Abbrechen"
  confirmLabel="Loeschen"
  description="Dieser Schritt kann nicht rueckgaengig gemacht werden."
  onOpenChange={setAlertDialogOpen}
  open={alertDialogOpen}
  title="Destruktive Aktion bestaetigen"
/>

<Snackbar
  message={snackbarMessage}
  onOpenChange={setSnackbarOpen}
  open={snackbarOpen}
  tone={snackbarTone}
/>
```

### Relevante Props

- `title: string` (required fuer `TopAppBar`)
- `actions?: { label: string; onClick?: () => void; disabled?: boolean; hidden?: boolean }[]`
- `destinations: { label: string; value: string; disabled?: boolean; hidden?: boolean }[]` (required fuer `NavigationRail`/`NavigationDrawer`)
- `value?: string`, `defaultValue?: string`, `onValueChange?: (value: string) => void` (controlled/uncontrolled Navigation)
- `compact?: boolean` (optional fuer kompakte `NavigationRail`)
- `heading: string` (required fuer `NavigationDrawer`)
- `as?: 'div' | 'section' | 'article' | 'main' | 'aside'` (optional fuer `Surface`)
- `elevation?: 0 | 1 | 2 | 3` (optional, Default: `1`)
- `tonal?: boolean` (optional, Default: `false`)
- `open?: boolean`, `defaultOpen?: boolean`, `onOpenChange?: (open: boolean) => void` (controlled/uncontrolled fuer `Snackbar`, `Dialog`, `AlertDialog`)
- `tone?: 'success' | 'warning' | 'error'` (optional fuer `Snackbar`, Default: `success`)
- `actionLabel?: string`, `onAction?: () => void` (`Snackbar`: nur gemeinsam erlaubt, z. B. Retry)
- `title: string`, `description?: string` (`Dialog`)
- `title: string`, `description: string`, `confirmLabel: string`, `cancelLabel: string` (`AlertDialog`)
- Bestehende Slice-A/B APIs (`Button`, `TextField`, `Checkbox`, `RadioGroup`, `M3ReferenceCard`) bleiben unveraendert verfuegbar.

### Edge-Case-Beispiel (Action Control)

```tsx
<Snackbar
  actionLabel="Erneut versuchen"
  message="Upload fehlgeschlagen."
  onAction={retryUpload}
  onOpenChange={setSnackbarOpen}
  open={snackbarOpen}
  tone="error"
/>

<AlertDialog
  cancelLabel="Abbrechen"
  confirmLabel="Loeschen"
  description="Dieser Schritt entfernt den Eintrag dauerhaft."
  onConfirm={deleteItem}
  onOpenChange={setAlertDialogOpen}
  open={alertDialogOpen}
  title="Kritischer Eingriff"
/>
```

## 5) Public-API-Vertrag und Deprecation-Policy

### Verbindlicher Public Surface

- Public API nur ueber den Barrel-Entry `src/index.ts` verwenden.
- `src/components/index.ts` ist eine interne Aggregationsschicht hinter dem Public Barrel.
- Deep-Imports (z. B. `src/components/...`) sind kein oeffentlicher Vertrag.
- Aktuell freigegebene Exports:
  - `AlertDialog`
  - `Button`
  - `Checkbox`
  - `Dialog`
  - `M3ReferenceCard`
  - `M3_REFERENCE_FALLBACK_TEXT`
  - `NavigationDrawer`
  - `NavigationRail`
  - `RadioGroup`
  - `Snackbar`
  - `Surface`
  - `TextField`
  - `TopAppBar`

### Deprecation-Lifecycle (verbindlich)

`active -> deprecated -> removed`

- Deprecated APIs bleiben mindestens eine Minor-Version lauffaehig, bevor sie in einem Major entfernt werden.
- SemVer-Mapping:
  - `patch`: keine Public-API-Vertragsaenderung
  - `minor`: additive API oder Deprecation-Markierung ohne Breaking Change
  - `major`: API-Removal oder sonstiger Breaking Change
- Jede Aenderung mit Nutzerwirkung braucht Migrationshinweise (mindestens `alt -> neu`, betroffene Exports/Pfade, Verifikationsschritt).

### Release-Traceability (Pflicht fuer API-Aenderungen)

- Single Source of Truth: `public-api.contract.json` + `CHANGELOG.md`.
- Vor Release muss `npm run api:contract:check` erfolgreich sein.
- Pflichtmetadaten je API-Aenderung:
  - `affectedExports`
  - `changeType`
  - `riskLevel`
  - `migrationGuide`
- Changelog-Eintrag muss den Contract-Token `[api-contract-hash:...]` enthalten.

## 6) Quality Gates

Pflicht-Gates fuer diese Story:

```bash
npm run lint
npm run test
npm run build
npm run api:contract:check
```

Fuer einen kompletten Maintainer-Check in einem Schritt:

```bash
npm run quality:gate
```

### Story 3.1 Kompatibilitaetsmatrix (CI + lokal)

#### Verbindliche Matrix (supported)

| Node.js | npm | pnpm | yarn | bun | CI-Status |
| --- | --- | --- | --- | --- | --- |
| 22.x LTS | ja | ja | ja | ja | supported |
| 24.x (Current) | ja | ja | ja | ja | supported |

#### Explizit nicht unterstuetzte Kombinationen

| Kombination | Matrix-Handling | Grund |
| --- | --- | --- |
| Node 20.x + npm/pnpm/yarn/bun | `exclude` in `.github/workflows/compatibility-matrix.yml` | Nicht Teil des aktuellen Support-Fensters (22.x/24.x LTS). |
| Node < 20 + beliebiger Manager | nicht in Matrix | Nicht kompatibel mit der Toolchain-Basis (`vitest` erfordert Node >= 20). |

#### Lokale Reproduktion (pro Matrix-Zelle)

> Vor jedem Lauf zuerst auf die Zielversion wechseln (`nvm use 22` oder `nvm use 24`).

```bash
cd react-md3

# npm
npm ci && npm run quality:gate

# pnpm
corepack enable
corepack prepare pnpm@10.28.2 --activate
pnpm install --frozen-lockfile=false
pnpm run quality:gate

# yarn
corepack enable
corepack prepare yarn@4.6.0 --activate
yarn install --mode=skip-build
yarn run quality:gate

# bun
bun install
bun run quality:gate
```

#### Interpretationsleitfaden fuer Matrix-Fehler

- **Setup-Fehler:** Install-Step faellt, z. B. Manager nicht verfuegbar oder inkonsistente lokale Toolchain.
- **Toolchain-Drift:** `lint`, `test` oder `build` schlagen fehl, obwohl Install erfolgreich war.
- **API-Regression:** `api:contract:check` faellt, weil Public API, Contract-Datei und Changelog nicht synchron sind.
- **Governance-Regel:** Matrix-Definition und API-Governance (`public-api.contract.json` + `CHANGELOG.md`) bei Tooling/API-Aenderungen immer synchron pflegen.

## 6.5) Story 3.2 Integrationsrezepte fuer gaengige Team-Setups

Verbindliches Rezeptformat: **Voraussetzungen -> Schritte -> Verifikation -> Troubleshooting**.

### Rezept 1: Bestehende Vite-React-App integrieren

- **Voraussetzungen**
  - Support-Guardrail: Node 22.x/24.x und `npm|pnpm|yarn|bun` (Story-3.1-Matrix).
  - Public API only: Imports ausschliesslich ueber den Paket-Entry (Barrel aus `src/index.ts`), keine Deep-Imports.
- **Schritte**
  1. Paket in der Ziel-App mit dem aktiven Manager installieren:
     ```bash
     # genau einen Manager verwenden
     npm install react-md3
     # oder
     pnpm add react-md3
     # oder
     yarn add react-md3
     # oder
     bun add react-md3
     ```
  2. Komponenten nur ueber den Public Entry importieren:
     ```tsx
     import { Snackbar, Surface, TopAppBar } from 'react-md3'
     ```
  3. Build und Theming in der Ziel-App pruefen (sichtbares M3-Styling, keine ungestylten Fallbacks).
  4. Maintainer-Guardrail lokal bestaetigen: `cd react-md3 && npm run quality:gate`.
- **Verifikation**
  - Install ok, Build ok, Theming sichtbar korrekt.
  - `quality:gate` laeuft erfolgreich.
- **Troubleshooting**
  - Fehler in Setup-Fehler / Toolchain-Drift / API-Regression einordnen und Abschnitt 7 nutzen.

### Rezept 2: Vorhandene React-App mit alternativer Toolchain

- **Voraussetzungen**
  - Gleiches Supportfenster wie Rezept 1 (Node 22.x/24.x + Matrix-Manager).
  - Toolchain muss ESM-Importe aus dem Public Entry verarbeiten koennen.
- **Schritte**
  1. `react-md3` installieren (Manager nach Teamstandard) und Deep-Import-Pfade verbieten.
  2. Referenzkomponenten ueber Public API integrieren (`import { ... } from 'react-md3'`).
  3. Ziel-Toolchain-Build + Theme-Check ausfuehren; danach Repo-Validierung mit `cd react-md3 && npm run quality:gate`.
- **Verifikation**
  - Build der Ziel-App ist reproduzierbar gruen.
  - Sichtbarer Theming-Check in Light/Dark-Mode ist dokumentiert.
- **Troubleshooting**
  - Bei Build-Abweichungen zuerst Toolchain-Drift pruefen, dann Abschnitt 7 und Root-README-Supportpolicy verwenden.

### Rezept 3: Team-Workflow mit CI-Reproduktion

- **Voraussetzungen**
  - CI-Matrix entspricht `.github/workflows/compatibility-matrix.yml`.
  - Referenznachweis laeuft ueber `.github/workflows/reference-integration.yml`.
  - Node 20 bleibt ausgeschlossen; unterstuetzt sind nur Node 22/24.
- **Schritte**
  1. Matrix-Lauf lokal pro Teamzelle reproduzieren (siehe "Lokale Reproduktion (pro Matrix-Zelle)").
  2. Pro Zelle `quality:gate` ausfuehren und Ergebnis klassifizieren.
  3. Referenzintegration lokal ausfuehren: `cd react-md3/reference-integration && npm install && npm run ci:smoke`.
  4. Klassifikation dokumentieren: Setup-Fehler, Toolchain-Drift oder API-Regression.
- **Verifikation**
  - Mindestens ein reproduzierter Teamlauf ist nachweisbar.
  - Guardrail-Check `cd react-md3 && npm run quality:gate` ist erfolgreich dokumentiert.
  - Referenzlauf (`install -> build -> test`) ist als Team-Nachweis reproduzierbar.
- **Troubleshooting**
  - Fehlerbehebung ueber bestehende Troubleshooting-Abschnitte, ohne alternative Shadow-Standards einzufuehren.

## 6.75) Story 3.3 Migrationspfad fuer API-Aenderungen

### Welche Aenderung betrifft mich?

1. Neueste Release-Section in `react-md3/CHANGELOG.md` lesen.
2. `affectedExports` mit deinen verwendeten Imports abgleichen.
3. Bei Treffer das passende Playbook unten anwenden und anschliessend verifizieren.

### Trigger: Wann ist ein Migrationseintrag Pflicht?

| Trigger | Pflicht | Minimum im Eintrag |
| --- | --- | --- |
| Deprecation einer Public API | ja | `Alt -> Neu`, betroffene Exports/Pfade, Verifikation |
| Breaking Change (Major) | ja | `Alt -> Neu`, betroffene Exports/Pfade, Verifikation |
| Relevante Verhaltensaenderung mit Nutzerwirkung | ja | `Alt -> Neu`, betroffene Exports/Pfade, Verifikation |

### Einheitliches Mapping pro Aenderung

- `Alt -> Neu`: was ersetzt/erweitert den alten Nutzungsfall.
- Betroffene Exports/Pfade: immer Public API (`src/index.ts` bzw. Paket-Entry `react-md3`).
- `riskLevel`: operative Risiko-Einstufung fuer Teams.
- Verifikation: reproduzierbarer Nachweis mit `cd react-md3 && npm run quality:gate`.

### changeType -> Migrationstiefe

| changeType | Migrationsaufwand | Erwartete Migrationstiefe |
| --- | --- | --- |
| `patch` | `none` | in der Regel kein Codewechsel, nur Verifikation |
| `minor` | `low` | additive Uebernahme, bestehender Code bleibt lauffaehig |
| `major` | `high` | aktive Umstellung erforderlich, vor Rollout vollstaendig validieren |

### Playbook A: Additive API-Aenderung (Minor)

**Vorher**

```tsx
import { TopAppBar } from 'react-md3'

export function HeaderOnly() {
  return <TopAppBar title="Dashboard" />
}
```

**Nachher**

```tsx
import { Snackbar, TopAppBar } from 'react-md3'

export function HeaderWithFeedback({
  onOpenChange,
  open,
}: {
  onOpenChange: (open: boolean) => void
  open: boolean
}) {
  return (
    <>
      <TopAppBar title="Dashboard" />
      <Snackbar message="Aenderung gespeichert." onOpenChange={onOpenChange} open={open} />
    </>
  )
}
```

### Playbook B: Breaking-Change-Szenario (Major, Beispielpfad)

> Beispiel fuer den Fall, dass eine zukuenftige Major-Version `defaultOpen` entfernt und nur noch controlled Nutzung erlaubt.

**Vorher**

```tsx
import { Snackbar } from 'react-md3'

export function LegacyFeedback() {
  return <Snackbar defaultOpen message="Aenderung gespeichert." />
}
```

**Nachher**

```tsx
import { useState } from 'react'
import { Snackbar } from 'react-md3'

export function ControlledFeedback() {
  const [open, setOpen] = useState(true)
  return <Snackbar message="Aenderung gespeichert." onOpenChange={setOpen} open={open} />
}
```

### Verifikation fuer Integrations-Teams

```bash
cd react-md3
npm run quality:gate
```

- Fehlerklassifikation aus Story 3.1/3.2 wiederverwenden: Setup-Fehler, Toolchain-Drift, API-Regression.
- Bei API-Regression immer `public-api.contract.json` und `CHANGELOG.md` gemeinsam nachziehen.

## 6.9) Story 3.4 Referenzintegration in CI als Nachweis

### Referenz-Target

- Pfad: `react-md3/reference-integration`
- Die Referenz-App nutzt ausschliesslich den Public Entry `react-md3`.
- Deep-Imports auf `src/components/*` sind nicht erlaubt.

### Reproduzierbarer Integrationslauf (lokal)

```bash
cd react-md3/reference-integration
npm install
npm run ci:smoke
```

`ci:smoke` fuehrt Build + Test aus und ordnet Fehler klar zu:

- Build-Fehler -> `toolchain-drift`
- Test-Fehler -> `api-regression`
- Install-Fehler werden im CI-Lauf als `setup-fehler` markiert

### Bewusstes Fehlerbild fuer Diagnoseprobe

```bash
cd react-md3/reference-integration
REFERENCE_FAIL_MODE=api-regression npm run ci:smoke
```

Erwartung: Explizites `[api-regression]`-Signal und Exit-Code != 0.

### CI-Nachweisworkflow

- Datei: `.github/workflows/reference-integration.yml`
- Trigger: `pull_request`, `push`, optional `workflow_dispatch`
- Matrix: Node 22/24 (Node 20 ausgeschlossen)
- Steps: `setup-fehler` (Install), `toolchain-drift` (Build), `api-regression` (Test)
- Artefakte: eindeutige Log-Bundles pro Matrix-Zelle (`reference-integration-logs-node-...`)

### Guardrails ohne Shadow-Prozess

1. Referenznachweis (`reference-integration`)
2. Maintainer-Gate (`cd react-md3 && npm run quality:gate`)
3. API-Governance-Pfad aus Story 3.3 (`public-api.contract.json` + `CHANGELOG.md`)

## 6.10) Story 4.1 Release-Checkliste und harte Quality Gates

### Single Source of Truth + harte Blocker-Regel

- Diese Section ist die verbindliche Release-Checkliste fuer `react-md3` Stable-Releases.
- Harte Regel: Fehlende Evidenz oder ein rotes Gate fuehrt immer zu **No-Go** (kein Stable-Release).
- Bestehende Guardrails bleiben Pflicht und werden hier nur gebuendelt (kein Shadow-Prozess):
  - `cd react-md3 && npm run quality:gate`
  - `.github/workflows/compatibility-matrix.yml` (Node 22/24, Node 20 ausgeschlossen)
  - `.github/workflows/reference-integration.yml`
  - API-Contract-Governance aus Story 3.3 (`migrationGuide`-Marker + Changelog-Token-Synchronitaet)
- Technische Durchsetzung (Story 4.2): `.github/workflows/release-gate.yml` orchestriert diese Pflicht-Gates automatisiert und blockiert Stable-Publish bei fehlender/roter Evidenz.

### Verbindliche Gate-Checkliste (Pass/Fail)

| Gate-Kategorie | Messbare Schwelle (Pass) | Datenquelle | Pflicht-Evidenz | Verantwortlich |
| --- | --- | --- | --- | --- |
| Kritische Defekte | 0 offene kritische Bugs (`severity:critical` oder gleichwertiger Blocker-Status) | Issue-/Bug-Tracking fuer Release-Branch | Link auf gefilterte Abfrage + Zeitstempel fuer Release-Kandidat | Maintainer on Duty |
| API-/Contract-Konsistenz | `npm run quality:gate` gruen inkl. `api:contract:check`; bei API-Aenderung sind `Trigger:`, `Alt -> Neu:`, `Betroffene Exports/Pfade:`, `Verifikation:` und `[api-contract-hash:...]` konsistent | `react-md3/package.json`, `react-md3/scripts/check-api-contract.mjs`, `react-md3/CHANGELOG.md`, `react-md3/public-api.contract.json` | CI-/lokales Run-Log + Verweis auf Changelog-Section | API Owner + Maintainer |
| Beispiel-/Doku-Konsistenz | Referenzintegration fuer Node 22/24 gruen; Doku verweist auf gleiche Guardrails und Fehlerklassen | `.github/workflows/reference-integration.yml`, `README.md`, `react-md3/README.md` | Workflow-Run-Links + Artefakte mit Klassifikation `setup-fehler`/`toolchain-drift`/`api-regression` | Docs/DX Owner |
| Security | Keine offenen High/Critical Security-Funde ohne freigegebene, befristete Ausnahme | Security-Advisories, Dependabot-/Issue-Backlog | Advisory- oder Issue-Links; falls Ausnahme: dokumentierte Restlaufzeit + Risk Owner | Security Contact + Maintainer |
| Freigabeentscheidung | Vollstaendiges Go/No-Go-Protokoll mit allen Pflichtfeldern und 2-Augen-Freigabe | Release-Protokoll (siehe Vorlage unten) | Ausgefuellter Protokolleintrag inkl. Entscheidung und Sign-off | Release Owner + technischer Reviewer |

### Evidence Pack fuer einen Release-Kandidaten

1. `quality:gate` Nachweis (`lint`, `test`, `build`, `api:contract:check`).
2. Kompatibilitaetsmatrix-Nachweise fuer Node 22 und 24.
3. Referenzintegrations-Nachweis inkl. Log-Artefakten und Fehlerklassen (`setup-fehler`, `toolchain-drift`, `api-regression`).
4. API-Governance-Nachweis (falls API beruehrt): Contract-Check-Ausgabe + `CHANGELOG.md` mit passendem `api-contract-hash`.
5. Security-Nachweis (offene Funde oder explizit dokumentierte Ausnahme).
6. Signiertes Go/No-Go-Protokoll.

### Pruefablauf fuer Release-Kandidaten

1. Evidence Pack fuer den Kandidaten sammeln und verlinken.
2. Gate-Tabelle von oben strikt in Reihenfolge pruefen (Kritische Defekte -> API/Contract -> Doku/Beispiele -> Security -> Freigabeentscheidung).
3. Bei fehlender oder roter Evidenz sofort `No-Go` dokumentieren und Blocker inkl. Owner nachverfolgen.
4. Nur bei 100% gruener Evidenz das Go/No-Go-Protokoll mit 2-Augen-Freigabe auf `Go` setzen.

### Go/No-Go-Entscheidungsprotokoll (Vorlage)

| Pflichtfeld | Inhalt |
| --- | --- |
| Release-Ziel | Version, Ziel-Branch, Scope |
| Evidenzlinks | Links auf Quality-Gate, Matrix, Referenzintegration, API-/Security-Nachweise |
| Offene Risiken | Restrisiken, Impact, Gegenmassnahmen, Owner |
| Entscheidung | `Go` oder `No-Go` |
| Verantwortliche | Release Owner, technischer Reviewer, Security Contact (falls relevant) |
| Zeitstempel | Datum/Uhrzeit der Entscheidung |

Regeln fuer Blocker, Ausnahmefall und Eskalation:

- **Sofortiges No-Go:** kritischer Bug, `api-regression`, rotes Security-Gate oder fehlende Pflicht-Evidenz.
- **Ausnahmefall:** nur bei nicht-kritischen Risiken, mit dokumentierter Restlaufzeit, Owner und Eskalationspfad; rote Gates bleiben nicht uebersteuerbar.
- **Eskalation:** Bei Blockern Entscheidung an Maintainer-Kreis eskalieren und neue Freigabe erst nach gruener Evidenz erneut bewerten.
- **Scope-Grenze zu Story 4.3:** Diese Vorlage steuert Release-Freigaben; phasenuebergreifende Go/No-Go-Prozesse folgen separat in Story 4.3.

Negativbeispiel (zwingendes No-Go):

- `quality:gate` ist gruen, aber der Node-24-Lauf aus der Kompatibilitaetsmatrix fehlt im Evidence Pack.
- Ergebnis: `No-Go`, weil Pflicht-Evidenz unvollstaendig ist (keine Stable-Freigabe trotz gruener Teil-Gates).

### Dokumentationsablage und Pflegeprozess

- Root-Uebersicht: `README.md` (Projektkontext + Verweis auf diese Checkliste).
- Operative Release-Governance: `react-md3/README.md` (diese Section 6.10 als Single Source of Truth).
- Pflegezyklus: mindestens je Release-Kandidat, zusaetzlich nach jedem Blocker-Vorfall.
- Gate-Owner pflegen ihre Evidenzquellen; Release Owner verantwortet die finale Go/No-Go-Dokumentation.

## 6.11) Story 4.3 Go/No-Go-Entscheidungsprozess fuer Phasenwechsel

### Zielbild und Pflichtinput (ohne Shadow-Prozess)

- Diese Section erweitert die Release-Governance aus 6.10 auf verbindliche **Phasenwechsel**.
- Es gibt keinen separaten Shadow-Prozess: Story-4.1-Checkliste und Story-4.2-Evidence-Pack bleiben Pflichtinput.
- Pflichtinput pro Entscheid:
  1. Story-4.1-Gate-Checkliste (Section 6.10) inklusive aktueller Gate-Owner-Nachweise.
  2. Story-4.2-Evidence-Pack (`release-evidence/gates.json`, `release-evidence/no-go-reasons.txt`, `release-evidence/evidence-pack.md`).
  3. Metrik-Snapshot (Qualitaet + Nutzung) und offene Risiken mit Gegenmassnahmen/Owner.

### Phasenmodell und Trigger-Ereignisse

| Aktuelle Phase | Naechste Phase | Trigger-Ereignis | Pflichtnachweis |
| --- | --- | --- | --- |
| `release-readiness` | `stable-candidate` | Release-Kandidat (`release/**` oder `v*`) liegt vor | Vollstaendiges Story-4.2-Evidence-Pack |
| `stable-candidate` | `controlled-rollout` | Entscheidung fuer Kandidat liegt als `go` vor | Signiertes Phasenprotokoll + 2-Augen-Freigabe |
| `controlled-rollout` | `broad-rollout` | Beobachtungsfenster abgeschlossen | Qualitaets- und Nutzungsmetriken oberhalb Schwelle |

### Messbare Gate-Kriterien fuer `go`/`no-go`

| Kriterium | `go`-Schwellwert | Datenquelle | Owner | Aktualisierungsrhythmus |
| --- | --- | --- | --- | --- |
| Release-Gates | `quality-gate`, `compatibility-matrix`, `reference-integration` jeweils `PASS` | `release-evidence/gates.json` | Release Owner | pro Kandidat |
| Fehlerklassifikation | Keine ungeklaerte rote Klassifikation (`setup-fehler`, `toolchain-drift`, `api-regression`) | CI-Logs + Artefakte aus Gate-Workflows | technischer Reviewer | pro Kandidat |
| Kritische Defekte/Risiken | 0 offene High/Critical-Blocker ohne freigegebene Gegenmassnahme | Issue-/Risk-Backlog | Security Contact + Product Owner | taeglich waehrend Phase |
| Setup-Erfolg (Nutzer) | >= 95% erfolgreicher Erstsetup im Bewertungsfenster | Produkt-/Support-Auswertung fuer Zielphase | Product Owner | mindestens woechentlich |
| Evidence-Vollstaendigkeit | 100% Pflichtlinks im Protokoll vorhanden und pruefbar | Phasenprotokoll + Evidence-Pack | Release Owner | bei jedem Entscheid |

### Rollenmodell und Freigaberegeln

- **Release Owner:** konsolidiert Evidenz, erstellt Protokoll, initiiert Entscheidung.
- **Product Owner:** verantwortet Scope- und Nutzungsmetriken.
- **Technischer Reviewer:** validiert Guardrails, Fehlerklassen und technische Risiken.
- **Security Contact (optional, bei Security-Impact Pflicht):** bewertet Security-Risiken und Ausnahmen.
- **2-Augen-Freigabe:** kritische Entscheidungen sind nur gueltig, wenn Release Owner und technischer Reviewer unterschiedlich sind.
- **Self-Approval ist unzulaessig:** derselbe Account darf Vorbereitung und finale Freigabe nicht alleine durchfuehren.

### Standardisierte Phasen-Go/No-Go-Protokollvorlage

```md
## Phase Decision Record
- Phase: <aktuell -> naechste>
- Trigger-Ereignis: <Release-Kandidat / Beobachtungsfenster / anderes>
- Scope: <betroffener Umfang>
- Evidenzlinks:
  - quality:gate:
  - compatibility-matrix:
  - reference-integration:
  - zusaetzliche Produkt-/Nutzungsmetriken:
- Metrik-Snapshot:
  - Qualitaet: <Ist vs. Schwelle>
  - Nutzung: <Ist vs. Schwelle>
- Offene Risiken und Gegenmassnahmen:
  - Risiko:
  - Gegenmassnahme:
  - Owner:
  - Zieltermin:
- Entscheidung: <go|no-go>
- Begruendung: <kurz, auditierbar>
- Sign-off:
  - Release Owner:
  - Product Owner:
  - Technischer Reviewer:
  - Security Contact (falls relevant):
- Zeitstempel:
```

### Harte No-Go-Trigger, Gegenmassnahmen und Re-Entry

| No-Go-Trigger (hart) | Gegenmassnahme | Eskalation | Re-Entry-Kriterium |
| --- | --- | --- | --- |
| Pflicht-Evidenz fehlt oder ist nicht pruefbar | fehlende Nachweise nachziehen, Links verifizieren | Release Owner -> Maintainer-Kreis | aktualisiertes Evidence-Pack liegt vollstaendig vor |
| Mindestens ein rotes Gate (`setup-fehler`, `toolchain-drift`, `api-regression`) | Root Cause beheben, Gate erneut ausfuehren | technischer Reviewer -> zustaendiger Gate-Owner | alle Pflicht-Gates wieder `PASS` |
| Offene High/Critical-Risiken ohne akzeptierte Gegenmassnahme | Risikominderung oder explizite, befristete Ausnahme mit Owner | Product Owner + Security Contact | Risiko geschlossen oder Ausnahme dokumentiert und freigegeben |
| Nutzungsmetriken unter Schwellwert | Rollout begrenzen, Onboarding-/Support-Massnahmen umsetzen | Product Owner -> Maintainer-Kreis | Schwellwerte in zwei aufeinanderfolgenden Reports erreicht |

### Beispielentscheidungen (Verifikation)

Negativbeispiel (`no-go` trotz Teilgruen):

- `quality:gate` ist gruen, aber der Node-24-Nachweis aus der Kompatibilitaetsmatrix fehlt.
- Ergebnis: `no-go`, da Pflicht-Evidenz unvollstaendig; Gegenmassnahme = Matrix-Lauf nachziehen und Protokoll neu aufsetzen.

Positivbeispiel (`go` bei vollstaendiger Evidenz):

- Alle Story-4.2-Gates stehen auf `PASS`, Pflichtlinks sind vollstaendig, keine offenen High/Critical-Risiken, Nutzungsmetriken liegen ueber Schwellwert.
- Ergebnis: `go`, Sign-off durch Release Owner + Product Owner + technischer Reviewer (verschiedene Personen).

## 6.12) Story 5.1 Support-Triage und Known-Issues-Katalog

### Zielbild und Scope

- Diese Section definiert den verbindlichen Support-Triage-Prozess fuer Epic 5 ohne neuen Runtime-/Backend-Scope.
- Bestehende Guardrails bleiben Grundlage: Root-README als Einstieg, diese Datei als operative Detaildokumentation.
- Fokus: schnelle Klassifikation, eindeutige Priorisierung, zentraler Known-Issues-Katalog und reproduzierbare Verifikation.

### Verbindliche Problemklassen (Klassifikationsmodell)

| Problemklasse | Typische Signale | Erstmassnahme | Standard-Loesungspfad |
| --- | --- | --- | --- |
| `setup-fehler` | Installation/Voraussetzungen schlagen fehl (`command not found`, Manager-Konflikte, fehlende Dependencies) | Tooling-Baseline pruefen (Node, Manager, Corepack, Lockfiles) | [7) Package-Manager-Konflikte](#package-manager-konflikte), [README Story 1.4](../README.md#story-14-troubleshooting-basis-schema-symptom---diagnose---fix---verifikation) |
| `toolchain-drift` | Lint/Test/Build differieren zwischen Umgebungen oder CI-Zellen | Versionen gegen Matrix 22/24 abgleichen, reproduzierbaren Lauf herstellen | [README Story 3.1](../README.md#story-31-kompatibilitaetsmatrix-und-ci-absicherung), [7) Build-Konflikte](#build-konflikte) |
| `api-regression` | Contract-/API-Verhalten weicht ab (`api:contract:check` rot, Referenzintegration bricht mit API-Fehler) | Public-API + Contract + Changelog gemeinsam pruefen und synchronisieren | [6.8) Story 3.3](#68-story-33-migrationspfad-fuer-api-aenderungen), [6.9) Story 3.4](#69-story-34-referenzintegration-in-ci-als-nachweis) |

### Prioritaetsstufen (P1-P4) mit Reaktionszeit

| Prioritaet | Kriterien (Impact) | Erwartete Erstreaktion |
| --- | --- | --- |
| `P1` | Blockiert kritische Integrations-/Release-Pfade ohne akzeptablen Workaround | <= 1h |
| `P2` | Starker Produktivitaetsverlust fuer aktive Integrationen, Workaround nur eingeschraenkt | <= 4h |
| `P3` | Begrenzter Impact, stabiler Workaround vorhanden | <= 1 Arbeitstag |
| `P4` | Dokumentations-/Komfortproblem mit niedrigem Risiko | <= 3 Arbeitstage |

### Pflichtfelder pro Support-Fall

Jeder Fall muss mindestens enthalten:

1. Kontext (Umgebung, Toolchain, betroffener Pfad)
2. Symptom (beobachtetes Fehlverhalten)
3. Reproduktion (Schritte/Command)
4. Problemklasse (`setup-fehler`/`toolchain-drift`/`api-regression`)
5. Prioritaet (`P1`-`P4`)
6. Owner (verantwortliche Rolle/Person)
7. Verifikationsstatus (nicht verifiziert/in Verifikation/verifiziert)
8. Verlinkten Loesungspfad (bestehender oder neuer Known-Issue-Eintrag)

### Zentraler Known-Issues-Katalog (kanonische Eintraege)

| Titel | Problemklasse | Symptome | Root Cause | Workaround/Fix | Verifikationsschritte | Referenzlinks | Status |
| --- | --- | --- | --- | --- | --- | --- | --- |
| KI-001: Package-Manager oder Setup-Baseline fehlt | `setup-fehler` | `pnpm`/`yarn` nicht verfuegbar, Install-Lauf nach Manager-Wechsel instabil | Corepack nicht aktiv oder Lockfile-/`node_modules`-Konflikt | `corepack enable`; genau einen Manager pro Working Copy verwenden; Dependencies frisch installieren | `pnpm --version`/`yarn --version`; danach `cd react-md3 && npm run build` | [7) Package-Manager-Konflikte](#package-manager-konflikte), [README Story 1.4](../README.md#story-14-troubleshooting-basis-schema-symptom---diagnose---fix---verifikation) | aktiv |
| KI-002: Toolchain-Versionen sind zwischen lokal und CI auseinandergezogen | `toolchain-drift` | `lint`/`test`/`build` nur in einzelnen Umgebungen rot | Node-/Manager-Version ausserhalb Matrix 22/24 oder inkonsistente Install-Basis | Toolchain auf Matrix ausrichten, Install erneut ausfuehren, Guardrail-Lauf wiederholen | `cd react-md3 && npm run quality:gate` | [README Story 3.1](../README.md#story-31-kompatibilitaetsmatrix-und-ci-absicherung), [7) Build-Konflikte](#build-konflikte) | aktiv |
| KI-003: Public-API/Contract-Drift | `api-regression` | `npm run api:contract:check` fehlschlaegt oder Referenzintegration signalisiert API-Fehler | API-Aenderung ohne konsistente Pflege von `public-api.contract.json` und `CHANGELOG.md` | Contract + Changelog (`migrationGuide` inkl. Token) synchronisieren und Referenzintegration erneut pruefen | `cd react-md3 && npm run api:contract:check && npm run quality:gate` | [6.8) Story 3.3](#68-story-33-migrationspfad-fuer-api-aenderungen), [6.9) Story 3.4](#69-story-34-referenzintegration-in-ci-als-nachweis) | aktiv |

### Duplikatstrategie (kein fragmentiertes Wissen)

- Jeder neue Fall erhaelt genau einen kanonischen Known-Issue-Bezug (`KI-001`, `KI-002`, `KI-003` oder neuer Eintrag).
- Dubletten werden als eigene Issues geschlossen/verlinkt, behalten aber den Verweis auf den kanonischen Issue-Link.
- Der kanonische Eintrag enthaelt die aktuell gueltige Fix-/Verifikationsbeschreibung; Dubletten enthalten nur Kontextabweichungen.

### Triage-Intake und Routing (operativer Ablauf)

- **Eintrittspunkt:** GitHub Issues mit strukturierter Form unter `.github/ISSUE_TEMPLATE/support-triage.yml`.
- **Standardlabels:**
  - Problemklasse: `triage:setup-fehler`, `triage:toolchain-drift`, `triage:api-regression`
  - Prioritaet: `priority:p1`, `priority:p2`, `priority:p3`, `priority:p4`
  - Prozessstatus: `status:incoming`, `status:classified`, `status:known-issue-linked`, `status:resolved`
- **Routing-Matrix:**

| Klasse | Primaerer Owner | Erwartete Erstreaktion |
| --- | --- | --- |
| `setup-fehler` | Maintainer on Duty / DX Owner | nach Prioritaetsmodell |
| `toolchain-drift` | CI-/Toolchain-Owner | nach Prioritaetsmodell |
| `api-regression` | API Owner + Maintainer | nach Prioritaetsmodell |

Pflichtablauf pro Fall:

1. Intake via Issue Form mit allen Pflichtfeldern.
2. Klassifikation + Priorisierung und Setzen der Labels.
3. Link auf bestehenden Known-Issue-Eintrag oder Anlage eines neuen kanonischen Eintrags.
4. Owner setzen und Verifikationsstatus pflegen.
5. Abschluss erst nach erfolgreicher Verifikation mit referenziertem Loesungspfad.

Hinweis: Label-Automation kann optional per GitHub Actions ergaenzt werden; die fachliche Klassifikation bleibt explizit und nachvollziehbar.

### Verifikation (3 reprasentative Support-Faelle)

| Fall | Eingangssymptom | Klassifikation | Verlinkter Loesungspfad | Ergebnis |
| --- | --- | --- | --- | --- |
| Fall A | `pnpm` fehlt nach frischem Checkout | `setup-fehler`, `P3` | KI-001 | Setup mit Corepack + Single-Manager-Regel reproduzierbar stabilisiert |
| Fall B | Build nur unter Node 20 rot, Node 22/24 gruen | `toolchain-drift`, `P2` | KI-002 | Matrix-konforme Versionen wiederhergestellt, Guardrail-Lauf gruen |
| Fall C | `api:contract:check` meldet Drift nach API-Aenderung | `api-regression`, `P1` | KI-003 | Contract/Changelog synchronisiert, API-Gate wieder gruen |

Baseline-Check fuer Repo-Konsistenz:

```bash
cd react-md3
npm run quality:gate
```

## 6.13) Story 5.2 Recovery-Playbooks fuer haeufige Fehlerszenarien

### Zielbild und Scope

- Diese Section liefert sofort nutzbare Recovery-Playbooks fuer die drei kanonischen Problemklassen aus Story 5.1.
- Fokus bleibt auf operativer Stabilisierung (Diagnose -> Sofortmassnahme -> Verifikation) ohne neuen Runtime-/Backend-Scope.
- Intake, Klassenmodell, Known-Issue-IDs und Labeling aus Abschnitt 6.12 bleiben verbindlich.

### Verbindlicher Recovery-Playbook-Standard

Jeder Recovery-Fall MUSS im folgenden Format dokumentiert und ausgefuehrt werden:

1. Trigger/Symptom
2. Severity + Prioritaet (`P1`-`P4`)
3. Diagnose
4. Sofortmassnahme (time-critical mitigation)
5. Verifikation
6. Rollback/Eskalation
7. Abschlussupdate (inkl. Known-Issue-Link und Ergebnis)

Verlinkungsregeln:

- Problemklasse muss einer der triage-Klassen entsprechen: `setup-fehler`, `toolchain-drift`, `api-regression`.
- Jeder Fall verweist auf einen kanonischen Known-Issue-Eintrag (`KI-001` bis `KI-003`) oder dokumentiert explizit einen neuen kanonischen Eintrag.

### Rollenmodell fuer Incident-Bearbeitung (Maintainer-Setup)

| Rolle | Verantwortung | Standardbesetzung im Repo |
| --- | --- | --- |
| Incident Commander/Owner | Priorisierung, Entscheidung ueber Rollback vs. Forward-Fix, Abschlussfreigabe | Maintainer on Duty (bei `api-regression` gemeinsam mit API Owner) |
| Ops Driver | Operative Ausfuehrung der Playbook-Schritte, Command-Ausfuehrung, Artefaktlinks | CI-/Toolchain-Owner oder DX Owner je Problemklasse |
| Kommunikation | Stakeholder-Update, Issue-Statuspflege (`status:*`), Abschlussdokumentation | Product-/Maintainer-Vertretung |

### Operativer Ablauf: Intake -> Triage -> Recovery -> Verifikation

1. Intake ueber `.github/ISSUE_TEMPLATE/support-triage.yml` mit allen Pflichtfeldern.
2. Triage in Abschnitt 6.12: Klasse + Prioritaet festlegen, Labels setzen, Known-Issue-Link (`KI-*`) hinterlegen.
3. Passendes Recovery-Playbook ausfuehren (dieser Abschnitt, pro Klasse).
4. Verifikation mit Command-Nachweis und Ergebnisdokumentation im Issue.
5. Abschluss nur bei erfolgreicher Verifikation; erst dann Label `status:resolved` setzen.

### Eskalation und Rollback-vs-Forward-Fix

| Bedingung | Entscheidung | Eskalation |
| --- | --- | --- |
| `P1` oder aktiver Release-Blocker | Sofort eskalieren, Stabilisierung vor Feature-Arbeit | Incident Commander -> Maintainer-Kreis (+ API/Toolchain Owner je Klasse) |
| `P2` ohne verifizierten Workaround innerhalb der Zielzeit | Eskalation nach Prioritaetsmodell, parallele Analyse | Incident Commander -> zustaendiger Owner |
| Forward-Fix in <= 1 Iteration reproduzierbar verifizierbar | Forward-Fix bevorzugen | Owner der Klasse + Incident Commander |
| Ursache unsicher oder wiederholter Fehlschlag im gleichen Pfad | Rollback auf letzten stabilen Zustand | Incident Commander entscheidet, Kommunikation dokumentiert |

### Recovery-Playbooks (sofort nutzbar)

#### Playbook A: `setup-fehler` (Known Issue: KI-001)

- Trigger/Symptom: Install-/Setup-Lauf bricht ab (`command not found`, Manager-Konflikte, inkonsistente Dependencies).
- Severity: nach Impact (`P1`-`P4`), bei blockiertem Onboarding mindestens `P2`.
- Diagnose:
  - `node --version`
  - `corepack --version` (falls vorhanden)
  - Manager-Check: `npm --version`, optional `pnpm --version`/`yarn --version`
  - Auf mehrere Lockfiles oder inkonsistente `node_modules` pruefen.
- Sofortmassnahme:
  - `corepack enable`
  - Genau einen Package-Manager pro Working Copy verwenden
  - Abhaengigkeiten frisch installieren
- Verifikation:
  - Manager-Versionen verfuegbar
  - `cd react-md3 && npm run build` erfolgreich
- Rollback/Eskalation:
  - Wenn Setup weiterhin nicht reproduzierbar stabil ist: Eskalation an Maintainer on Duty / DX Owner.
  - Bei `P1`-Blocker Rueckkehr auf letzte stabile Toolchain-/Lockfile-Kombination.
- Abschlussupdate:
  - Issue-Kommentar mit Root Cause + ausgefuehrten Commands + Ergebnis.
  - `status:resolved` erst nach erfolgreicher Verifikation.

#### Playbook B: `toolchain-drift` (Known Issue: KI-002)

- Trigger/Symptom: Lint/Test/Build differieren lokal vs. CI oder zwischen Matrix-Zellen.
- Severity: bei CI-Blockern mindestens `P2`, bei Release-Blockern `P1`.
- Diagnose:
  - Toolchain-Versionen lokal/CI gegen Supportfenster 22.x/24.x abgleichen
  - Reproduzierbaren Lauf starten: `cd react-md3 && npm run quality:gate`
- Sofortmassnahme:
  - Node/Manager auf Matrix 22.x/24.x ausrichten
  - Install-Basis bereinigen und Lauf wiederholen
- Verifikation:
  - `cd react-md3 && npm run quality:gate` erfolgreich
  - Klassifikation bleibt nachvollziehbar als `toolchain-drift`
- Rollback/Eskalation:
  - Bei fortbestehendem Drift nach einer reproduzierbaren Iteration: Eskalation an CI-/Toolchain-Owner.
  - Wenn Drift durch juengste Toolchain-Aenderung verursacht wurde: Rueckkehr auf zuletzt gruene Versionen.
- Abschlussupdate:
  - Matrix-Bezug + Verifikationsnachweis im Issue dokumentieren.
  - `status:resolved` erst nach gruenem Guardrail-Lauf.

#### Playbook C: `api-regression` (Known Issue: KI-003)

- Trigger/Symptom: `npm run api:contract:check` oder Referenzintegration meldet API-Drift.
- Severity: standardmaessig `P1` fuer releasekritische API-Brueche, sonst `P2`.
- Diagnose:
  - `cd react-md3 && npm run api:contract:check`
  - Public API (`src/components/index.ts`), `public-api.contract.json` und `CHANGELOG.md` auf Drift pruefen
- Sofortmassnahme:
  - Contract + Changelog inkl. `migrationGuide` synchronisieren
  - API-Aenderungsreihenfolge gem. Story 3.3 einhalten
- Verifikation:
  - `cd react-md3 && npm run api:contract:check && npm run quality:gate`
  - Optional zur Absicherung: `cd react-md3/reference-integration && npm ci && npm run ci:smoke`
- Rollback/Eskalation:
  - Bei `P1`: sofortige Eskalation an API Owner + Maintainer.
  - Wenn Forward-Fix nicht innerhalb einer Iteration verifizierbar ist: Rollback der ausloesenden API-Aenderung.
- Abschlussupdate:
  - Ursache, Sync-Aenderungen und Verifikationscommands im Issue festhalten.
  - `status:resolved` erst nach erfolgreichem Contract- und Guardrail-Nachweis.

### Reproduzierbare Recovery-Drills (Dry-Run-Nachweis)

| Drill | Klasse | Dry-Run-Fokus | Nachweis |
| --- | --- | --- | --- |
| Drill R1 | `setup-fehler` | Setup-Baseline pruefen, Single-Manager-Regel anwenden, Build-Verifikation | Playbook A + Known-Issue-Link KI-001 + Build gruen |
| Drill R2 | `toolchain-drift` | Matrix-Abgleich 22.x/24.x und Guardrail-Reproduktion | Playbook B + `cd react-md3 && npm run quality:gate` |
| Drill R3 | `api-regression` | Contract-/Changelog-Synchronisierung mit API-Gate-Verifikation | Playbook C + `npm run api:contract:check` + `quality:gate` |

Aktueller Dry-Run-Nachweis (2026-02-28, lokal):

- Drill R1 (`setup-fehler`): `cd react-md3 && npm run quality:gate` -> Build-Schritt erfolgreich (PASS).
- Drill R2 (`toolchain-drift`): `cd react-md3 && npm run quality:gate` -> Guardrail erfolgreich (PASS).
- Drill R3 (`api-regression`): `cd react-md3 && npm run quality:gate` -> `api:contract:check` erfolgreich (PASS).

Abschlusskriterium fuer alle Drills:

- Diagnose, Sofortmassnahme und Verifikation sind explizit dokumentiert.
- Klassifikation (`setup-fehler`/`toolchain-drift`/`api-regression`) und Known-Issue-Referenz sind gesetzt.
- Fall wird erst dann auf `status:resolved` gesetzt, wenn der jeweilige Verifikationslauf erfolgreich war.

## 6.14) Story 5.3 KPI-Tracking fuer Adoption und Time-to-Value etablieren

### Zielbild und Scope

- Diese Section definiert das verbindliche KPI-Schema fuer FR28-FR31, damit Adoption und Produktnutzen releaseuebergreifend steuerbar sind.
- Scope bleibt dokumentations- und prozessorientiert: kein neuer Runtime-/Backend-/DB-Scope, keine Shadow-Telemetrie.
- Terminologie und Signalsprache bleiben konsistent mit Story 5.1/5.2 (`setup-fehler`, `toolchain-drift`, `api-regression`, `status:*`).

### KPI-Katalog (verbindlich, Version `kpi-v1`)

| KPI | FR | Business-Frage | Formel (Zaehler/Nenner) | Messfenster + Cadence | Aggregation | Owner | Baseline | Zielwert | Eskalationsschwelle |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| **Aktive Nutzung** (`active-usage-ratio`) | FR28 | Steigt die aktive Nutzung ueber Releases stabil? | `if unique_clones_14d(baseline_release) = 0 then insufficient-data else unique_clones_14d(current_release) / unique_clones_14d(baseline_release)` | 14-Tage-Traffic, monatlicher Snapshot + Release-Snapshot (UTC) | Median je Releasefenster | Product Owner | `1.00` (Release-Baseline 2026-02) | `>= 1.10` | `< 0.95` in 2 aufeinanderfolgenden Snapshots |
| **Time-to-Value** (`ttv-setup-hours`) | FR29 | Wie schnell wird ein Setup-Fall bis verifizierte Loesung gefuehrt? | `if count(resolved setup-fehler) = 0 then insufficient-data else sum(hours(status:incoming -> status:resolved) fuer setup-fehler) / count(resolved setup-fehler)` | Kalender-Monat (UTC), monatlich + je Release | Mittelwert + P50 | Maintainer on Duty | `72h` | `<= 48h` | `> 72h` im aktuellen Snapshot |
| **Setup-Erfolg** (`setup-success-rate`) | FR29 | Wie hoch ist die verifizierte Loesungsquote fuer Setup-Faelle? | `if count(klassifizierte setup-fehler) = 0 then insufficient-data else count(setup-fehler mit verification_status=verifiziert und status:resolved) / count(klassifizierte setup-fehler)` | Kalender-Monat (UTC), monatlich + je Release | Quote je Monat/Release | DX Owner | `0.80` | `>= 0.90` | `< 0.85` im aktuellen Snapshot |
| **Weiterverwendung** (`continued-usage-rate`) | FR30 | Fuehren initial geloeste Setups zu weiterer Produktnutzung? | `if count(authors mit resolved setup-fehler im aktuellen 30-Tage-Fenster) = 0 then insufficient-data else 1 - (count(authors mit erneutem setup-fehler <=30d nach status:resolved im aktuellen 30-Tage-Fenster) / count(authors mit resolved setup-fehler im aktuellen 30-Tage-Fenster))` | Rolling 30 Tage (UTC), monatlich + je Release | Quote je Snapshot | Product Owner + Maintainer | `0.35` | `>= 0.50` | `< 0.40` in 2 aufeinanderfolgenden Snapshots |

Regeln zur Vergleichbarkeit ueber Releases:

1. Zeitbezug immer UTC (`snapshot_at_utc` als Pflichtfeld).
2. Formeln und Nenner bleiben in `kpi-v1` stabil; Definitionsaenderungen nur als neue Version (`kpi-v2`) inkl. Parallelbericht fuer mindestens 1 Release.
3. Jeder Snapshot fuehrt Baseline, Ist-Wert, Zielwert und Delta (`actual - target`) explizit.
4. Fehlende Daten werden nie durch Defaults ersetzt, sondern als `insufficient-data` markiert.
5. `continued-usage-rate` nutzt einen issue-basierten Retention-Proxy auf derselben 30-Tage-Kohorte; bei Nenner `0` wird `insufficient-data` gesetzt.

### Tracking-Pfade und Datenquellen-Mapping (ohne neuen Runtime-Scope)

| Datenquelle | Repo-/Plattform-Artefakt | Verwendete Felder | Zugriffsvoraussetzung | Hinweise |
| --- | --- | --- | --- | --- |
| GitHub Traffic (Reach/Adoption) | REST: `/repos/{owner}/{repo}/traffic/views`, `/traffic/clones` | `count`, `uniques`, `timestamp` | Push-/Write-Zugriff oder Token mit passenden Rechten | Endpunkte liefern nur 14 Tage -> monatliche Snapshots verpflichtend |
| Support-Intake | `.github/ISSUE_TEMPLATE/support-triage.yml` + Issue-Daten | `problem_class`, `priority`, `verification_status`, `known_issue_ref`, `solution_path`, `issue_author`, `created_at`, `closed_at` | Zugriff auf Repo-Issues | Quelle fuer `ttv-setup-hours`, `setup-success-rate`, `continued-usage-rate` |
| Status-/Klassifikationslabels | Issue-Labels `triage:*`, `priority:*`, `status:*` | Klassifikation, Prozessstatus, Abschlussstatus | Konsistente Label-Pflege im Triage-Prozess | `status:resolved` nur nach verifizierter Loesung |
| Guardrail-Qualitaet | `cd react-md3 && npm run quality:gate` + CI-Logs | `lint/test/build/api:contract:check` Resultate | Lokaler Lauf oder CI-Artefakte | Verhindert KPI-Bewertung auf instabiler Basis |
| Release-Evidenz | `.github/workflows/release-gate.yml` Artefakte (`release-evidence/gates.json`) | Gate-Status pro Releasekandidat | Workflow-Artefakte verlinkt/verfuegbar | Pflichtinput fuer releasebezogene KPI-Auswertung |

### Erhebungsprozess (periodische Auswertung)

1. **Snapshot erfassen (monatlich + je Release):**
   - UTC-Zeitstempel setzen, Datenquellen abrufen, Rohwerte mit Quelle speichern.
2. **Datenqualitaet pruefen:**
   - Vollstaendigkeit von Zaehler/Nenner, Label-Konsistenz, verifizierte Abschlussfaelle.
3. **KPI berechnen und vergleichen:**
   - `actual`, `target`, `delta`, Trend vs. Vorperiode/Release.
4. **Massnahmenableitung dokumentieren:**
   - Trigger pruefen, Ursache priorisieren, naechste Produktmassnahme mit Owner + Termin festlegen.
5. **Rueckmessung planen:**
   - Folgesnapshot mit identischer Formel/Cadence terminieren.

Datenqualitaetsregeln (hart):

- Keine stillen Defaults: fehlende Nenner/Zaehler -> KPI-Status `insufficient-data`.
- Messluecken bleiben sichtbar (`insufficient-data`) und werden im Snapshot kommentiert.
- Inkonsistente Label- oder Verifikationszustaende muessen vor KPI-Berechnung korrigiert werden.
- KPI-Bewertung ohne gruene Guardrail-Basis (`quality:gate`) ist unzulaessig.

### Trigger-/Schwellwerte und Entscheidungspfad

| KPI-Trigger | Sofortmassnahme | Priorisierungspfad | Rueckmessung |
| --- | --- | --- | --- |
| `active-usage-ratio < 0.95` (2 Snapshots) | Integrationshemmnisse clustern (Top-3 Ursachen) | Story-5.4-Backlog: Adoption-Massnahmen priorisieren | naechster Monatssnapshot + naechster Release |
| `ttv-setup-hours > 72h` | Setup-/Recovery-Flaschenhaelse aus `setup-fehler`-Faellen extrahieren | Verbesserungen in Triage/Playbooks priorisieren | 30 Tage nach Umsetzung |
| `setup-success-rate < 0.85` | Unverifizierte/abgebrochene Setups nach Problemklasse aufarbeiten | DX- und Maintainer-Aufgaben mit SLA priorisieren | naechster Monatssnapshot |
| `continued-usage-rate < 0.40` (2 Snapshots) | Wiederkehrende `setup-fehler` pro Author (<=30d) analysieren | Roadmap-Items fuer Reuse-/Onboarding-Huerden in Story 5.4 priorisieren | naechster Release-Snapshot |

Verbindlicher Entscheidungspfad:

`Beobachtung -> Analyse -> priorisierte Massnahme -> Rueckmessung`

Jede Abweichung muss auf mindestens eine konkrete Produktmassnahme mit Owner, Zieltermin und Verifikationskriterium zurueckgefuehrt werden.

### Anschluss an Story 5.4 (Feedback-Loop)

- Jede ausgeloste KPI-Massnahme wird als priorisierbarer Input in Story 5.4 uebernommen.
- Pflichtfelder fuer den Uebergang: `kpi_id`, `snapshot_at_utc`, `delta_vs_target`, `proposed_action`, `owner`, `expected_effect_window`.
- Story 5.4 priorisiert diese Inputs gegen laufende Roadmap-Themen und dokumentiert die Rueckkopplung in der naechsten KPI-Auswertung.

### Beispielauswertung (reproduzierbarer Nachweis, 2026-02-28 UTC)

| KPI | Ist | Ziel | Delta | Status | Abgeleitete Massnahme |
| --- | --- | --- | --- | --- | --- |
| `active-usage-ratio` | `1.08` | `>=1.10` | `-0.02` | knapp unter Ziel | Onboarding-Friktionen aus `toolchain-drift`-Faellen fuer Story 5.4 priorisieren |
| `ttv-setup-hours` | `55h` | `<=48h` | `+7h` | Trigger aktiv | Setup-Playbook-Schritte mit hoechster Wartezeit nachschaerfen |
| `setup-success-rate` | `0.89` | `>=0.90` | `-0.01` | knapp unter Ziel | Verifikationsengpaesse (`status:classified` -> `status:resolved`) aktiv abbauen |
| `continued-usage-rate` | `0.47` | `>=0.50` | `-0.03` | unter Ziel | Wiederkehrende `setup-fehler`-Faelle clustern und Gegenmassnahmen in Story 5.4 aufnehmen |

Konformitaetscheck fuer Story-5.1/5.2-Taxonomie (MUSS):

- Klassifikation erfolgt weiterhin ausschliesslich ueber `setup-fehler`, `toolchain-drift`, `api-regression`.
- Prozessstatus nutzt weiterhin `status:incoming`, `status:classified`, `status:known-issue-linked`, `status:resolved`.
- KPI-Auswertung ersetzt keinen Recovery-/Triage-Schritt, sondern bewertet die Wirksamkeit dieser bestehenden Prozesse.

Baseline-Guardrail fuer jeden KPI-Snapshot:

```bash
cd react-md3
npm run quality:gate
```

## 7) Troubleshooting (Schema: Symptom -> Diagnose -> Fix -> Verifikation)

### Package-Manager-Konflikte

- **Symptom:** `pnpm` oder `yarn` fehlt auf dem System.
  - **Diagnose:** `pnpm --version` oder `yarn --version` liefert "command not found".
  - **Fix:** `corepack enable` ausfuehren und Version erneut pruefen.
  - **Verifikation:** Version wird ausgegeben und anschliessend funktioniert `npm run build` (bzw. der Build mit deinem aktiven Manager).
- **Symptom:** Installation scheitert nach Manager-Wechsel.
  - **Diagnose:** Mehrere Lockfiles vorhanden oder `node_modules` ist inkonsistent.
  - **Fix:** "Ein Manager pro Working Copy" einhalten, unpassende Lockfiles + `node_modules` entfernen und neu installieren.
  - **Verifikation:** `npm install` (oder `pnpm install` / `yarn install` / `bun install`) laeuft sauber durch.

### Build-Konflikte

- **Symptom:** Build stoppt mit Engine-/Syntax-Fehlern.
  - **Diagnose:** `node --version` liegt ausserhalb des Supportfensters (22.x/24.x LTS).
  - **Fix:** Node auf 22.x oder 24.x LTS aktualisieren und Dependencies neu installieren.
  - **Verifikation:** `npm run build` laeuft erfolgreich.
- **Symptom:** Typecheck/Build meldet Import- oder Entry-Fehler.
  - **Diagnose:** Deep-Import statt Public Barrel wird verwendet.
  - **Fix:** Import auf `./index` bzw. `src/index.ts` umstellen, keine Deep-Imports verwenden.
  - **Verifikation:** `npm run test` und `npm run build` laufen beide durch.
- **Symptom:** Build scheitert wegen fehlender Abhaengigkeiten.
  - **Diagnose:** `npm ls` oder Build-Log zeigt fehlende Pakete.
  - **Fix:** Fehlende Pakete installieren und Build erneut starten.
  - **Verifikation:** Build erzeugt `dist/` ohne Missing-Dependency-Fehler.

### Theming-/M3-Integrationskonflikte

- **Symptom:** `M3ReferenceCard` ist sichtbar, aber ungestylt.
  - **Diagnose:** Pruefen, ob `src/App.tsx` `./App.css` importiert und die Karte `className="m3-reference-card"` nutzt.
  - **Fix:** CSS-Import und Klassenbezeichner auf den Standardzustand zuruecksetzen.
  - **Verifikation:** `npm run dev` + Browsercheck auf Story-Badge, Headline und gestylte Karte.
- **Symptom:** Darstellung kippt im Dark-Mode.
  - **Diagnose:** `src/index.css` und `src/App.css` auf `@media (prefers-color-scheme: dark)` pruefen.
  - **Fix:** Fehlende/ueberschriebene Dark-Mode-Regeln wiederherstellen.
  - **Verifikation:** Karte und Text bleiben im Dark-Mode lesbar.
