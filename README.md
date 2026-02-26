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

### Haeufige Fehlerbilder (Install/Import) mit Diagnose und Fix

| Fehlerbild | Diagnose | Fix |
| --- | --- | --- |
| `pnpm`/`yarn` nicht gefunden | Corepack nicht aktiv oder Tool nicht vorbereitet | `corepack enable` und danach Version pruefen (`pnpm --version` / `yarn --version`) |
| Lockfile-Konflikte nach Manager-Wechsel | Mehrere Lockfiles bzw. alter `node_modules`-Stand | Working Copy bereinigen (`node_modules` + unpassende Lockfiles) und mit genau einem Manager neu installieren |
| Build/Import-Fehler wegen falschem Einstieg | Deep-Import oder falscher Entry verwendet | Public API nur ueber `src/index.ts` nutzen (kein Deep-Import) |
| Tooling bricht frueh mit Engine-/Syntax-Hinweisen | Node-Version nicht auf 24.x-LTS-Baseline | Node auf aktuelle 24.x-LTS-Version heben und Install erneut ausfuehren |

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
