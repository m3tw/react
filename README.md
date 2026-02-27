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
  - CI orientiert sich an `.github/workflows/compatibility-matrix.yml`.
  - Supportfenster bleibt explizit: Node 22/24 supported, Node 20 ausgeschlossen.
- **Schritte**
  1. Matrix-Zelle lokal mit dem jeweiligen Manager reproduzieren (siehe Story-3.1-Abschnitt "Lokale Reproduktion der CI-Matrix").
  2. In jeder relevanten Zelle `quality:gate` ausfuehren.
  3. Ergebnis je Fehlerklasse dokumentieren (Setup-Fehler, Toolchain-Drift, API-Regression) und passenden Recovery-Pfad anwenden.
- **Verifikation**
  - Mindestens ein reproduzierter Teamlauf mit `cd react-md3 && npm run quality:gate` ist dokumentiert.
  - Fehlerklassifikation und Gegenmassnahmen sind fuer das Team nachvollziehbar.
- **Troubleshooting**
  - Setup-/Build-/Theming-Probleme ueber bestehende Troubleshooting-Abschnitte eskalieren, ohne parallele Shadow-Doku aufzubauen.

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
