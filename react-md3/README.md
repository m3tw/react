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
  - **Diagnose:** `node --version` ist nicht 24.x LTS.
  - **Fix:** Node auf 24.x LTS aktualisieren und Dependencies neu installieren.
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
