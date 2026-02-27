# react-md3 Getting-Started (<= 5 Minuten)

Kompakter Einstieg vom frischen Setup bis zu produktiven Komponenten (`TopAppBar`, `NavigationRail`, `NavigationDrawer`, `Surface` plus bestehende Basis-Komponenten).

## 1) Voraussetzungen

- Node.js 24.x LTS
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

1. Story-Badge: `Story 2.4 Navigation/Surfaces`
2. Headline: `M3 Navigation & Surfaces sind bereit`
3. Sichtbare Komponenten inkl. Varianten: `TopAppBar`, `NavigationRail` (kompakt/erweitert), `NavigationDrawer`, `Surface`

Damit ist mindestens eine produktive M3-Komponente lauffaehig integriert.

## 4) API-Hinweise + Standardbeispiel

Die Komponente wird ueber den Public Barrel genutzt:

- `src/App.tsx` importiert aus `./index`
- `src/index.ts` exportiert aus `./components`
- `src/components/index.ts` exportiert alle freigegebenen UI-Bausteine inkl. Navigation/Surface-Slice
- Keine Deep-Imports verwenden

### Importpfad in `src/App.tsx`

```tsx
import { NavigationDrawer, NavigationRail, Surface, TopAppBar } from './index'
```

### Standardbeispiele

```tsx
<TopAppBar
  actions={[{ label: 'Suche' }, { label: 'Sync pausiert', disabled: true }]}
  title="M3 Navigation & Surfaces sind bereit"
/>

<NavigationRail
  compact
  destinations={[
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Projekte', value: 'projekte' },
  ]}
  onValueChange={setActiveDestination}
  value={activeDestination}
/>

<NavigationDrawer
  destinations={[
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Projekte', value: 'projekte' },
  ]}
  heading="Projektbereiche"
  onValueChange={setActiveDestination}
  value={activeDestination}
/>

<Surface as="main" elevation={2} tonal>
  <h1>Navigation Surface Referenzlayout</h1>
</Surface>
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
- Bestehende Slice-A/B APIs (`Button`, `TextField`, `Checkbox`, `RadioGroup`, `M3ReferenceCard`) bleiben unveraendert verfuegbar.

### Edge-Case-Beispiel (Action Control)

```tsx
<TopAppBar
  actions={[
    { label: 'Sync pausiert', disabled: true },
    { label: 'Versteckte Aktion', hidden: true },
  ]}
  title="M3 Navigation"
/>

<NavigationRail
  destinations={[
    { label: 'Dashboard', value: 'dashboard' },
    { label: 'Reports', value: 'reports', disabled: true },
    { label: 'Archiv', value: 'archiv', hidden: true },
  ]}
  onValueChange={setActiveDestination}
  value={activeDestination}
/>

<Surface as="aside" elevation={1}>
  Disabled/Hidden Destination bleibt fuer Nutzer klar nachvollziehbar.
</Surface>
```

## 5) Public-API-Vertrag und Deprecation-Policy

### Verbindlicher Public Surface

- Public API nur ueber den Barrel-Entry `src/index.ts` verwenden.
- `src/components/index.ts` ist eine interne Aggregationsschicht hinter dem Public Barrel.
- Deep-Imports (z. B. `src/components/...`) sind kein oeffentlicher Vertrag.
- Aktuell freigegebene Exports:
  - `Button`
  - `Checkbox`
  - `M3ReferenceCard`
  - `M3_REFERENCE_FALLBACK_TEXT`
  - `NavigationDrawer`
  - `NavigationRail`
  - `RadioGroup`
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
