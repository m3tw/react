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

## 6) Troubleshooting

- Package-Manager fehlt: `corepack enable` ausfuehren und Version pruefen
- Importfehler: nur Public API (`src/index.ts`) verwenden, keine Deep-Imports
- Node-Probleme: Node auf 24.x LTS aktualisieren und erneut installieren
