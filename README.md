# react

## Story 1.1 Startpunkt

Diese Basis implementiert den ersten produktiven Setup-Schritt aus Story 1.1:
Vite + React + TypeScript ist lauffaehig, inklusive einer ersten renderbaren M3-Referenzkomponente.

## Voraussetzungen

- Node.js LTS (Baseline aus den Story-Notizen)
- npm (inkl. `npx`)

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
