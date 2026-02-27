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
  - Node 20 bleibt ausgeschlossen; unterstuetzt sind nur Node 22/24.
- **Schritte**
  1. Matrix-Lauf lokal pro Teamzelle reproduzieren (siehe "Lokale Reproduktion (pro Matrix-Zelle)").
  2. Pro Zelle `quality:gate` ausfuehren und Ergebnis klassifizieren.
  3. Klassifikation dokumentieren: Setup-Fehler, Toolchain-Drift oder API-Regression.
- **Verifikation**
  - Mindestens ein reproduzierter Teamlauf ist nachweisbar.
  - Guardrail-Check `cd react-md3 && npm run quality:gate` ist erfolgreich dokumentiert.
- **Troubleshooting**
  - Fehlerbehebung ueber bestehende Troubleshooting-Abschnitte, ohne alternative Shadow-Standards einzufuehren.

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
