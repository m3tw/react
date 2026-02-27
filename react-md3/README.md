# react-md3 Getting-Started (<= 5 Minuten)

Kompakter Einstieg vom frischen Setup bis zur ersten produktiven Komponente (`M3ReferenceCard`).

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

1. Story-Badge: `Story 1.3 Getting Started`
2. Headline: `M3 Getting Started ist bereit`
3. Sichtbare Komponente: `M3 Referenzkomponente`

Damit ist mindestens eine produktive M3-Komponente lauffaehig integriert.

## 4) API-Hinweise + Standardbeispiel

Die Komponente wird ueber den Public Barrel genutzt:

- `src/App.tsx` importiert aus `./index`
- `src/index.ts` exportiert aus `./components`
- `src/components/index.ts` exportiert `M3ReferenceCard`
- Keine Deep-Imports verwenden

### Importpfad in `src/App.tsx`

```tsx
import { M3ReferenceCard } from './index'
```

### Standardbeispiel

```tsx
<M3ReferenceCard
  title="M3 Referenzkomponente"
  supportingText="Diese erste produktive Komponente verifiziert den lauffaehigen 5-Minuten-Flow."
/>
```

### Relevante Props

- `title: string` (required)
- `supportingText?: string` (optional, Fallbacktext wird automatisch gesetzt)

## 5) Quality Gates

Pflicht-Gates fuer diese Story:

```bash
npm run lint
npm run test
npm run build
```

## 6) Troubleshooting (Schema: Symptom -> Diagnose -> Fix -> Verifikation)

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
