---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments:
  - _bmad-output/planning-artifacts/prd.md
  - _bmad-output/planning-artifacts/product-brief-react-2026-02-26.md
  - _bmad-output/planning-artifacts/research/technical-react-md3-shadcn-style-library-research-2026-02-26.md
  - _bmad-output/planning-artifacts/research/domain-react-md3-shadcn-style-library-research-2026-02-26.md
workflowType: 'architecture'
project_name: 'react'
user_name: 'Darko'
date: '2026-02-26T13:04:00.337Z'
lastStep: 8
status: 'complete'
completedAt: '2026-02-26T13:04:00.337Z'
---

# Architecture Decision Document

_This document builds collaboratively through step-by-step discovery. Sections are appended as we work through each architectural decision together._

## Project Context Analysis

### Requirements Overview

**Functional Requirements:**
32 FRs in 8 Gruppen mit Fokus auf M3-Komponentenabdeckung, schneller Integration (<=5 Minuten bis erste produktive Komponente), stabiler API-Evolution, belastbarer Dokumentation/Beispielen und messbarer Adoption.

**Non-Functional Requirements:**
Treiber sind Performance (reaktive UI + Budget-Orientierung), Security (keine kritischen Vulns, Provenance), Scalability (10x Wachstum ohne Qualitätsabfall), Accessibility (WCAG 2.2 AA), Integration (grüne Support-Matrix) und Reliability (keine kritischen Regressionen in Stable-Releases).

**Scale & Complexity:**
Die Anforderungen deuten auf ein mittelkomplexes, governance-getriebenes Library-Produkt mit hoher Qualitätsdisziplin.

- Primary domain: web/frontend developer tooling
- Complexity level: medium
- Estimated architectural components: 10

### Technical Constraints & Dependencies

SemVer-Disziplin, dokumentierte Deprecation-Policy, React/Node/Build-Kompatibilitätsmatrix, CI-validierte Beispiele, und vollständige Material-3-Komponentenabdeckung bei phasenweiser Lieferung.

### Cross-Cutting Concerns Identified

API-Stabilität, Teststrategie (Unit/Integration/E2E), Doku-zu-API-Konsistenz, Accessibility-by-default, Performance-Budgeting, Release-Governance und Supply-Chain-Sicherheit.

## Starter Template Evaluation

### Primary Technology Domain

Web/frontend component library (React + TypeScript), basierend auf den Projektanforderungen.

### Starter Options Considered

1. **Vite React-TS Starter** (`npm create vite@latest ... --template react-ts`)
   - Offizieller, aktiv gepflegter Einstieg
   - Sehr gute DX und schnelle Builds
   - Vite Library-Mode ist offiziell dokumentiert

2. **Turborepo Design-System Starter** (`npx create-turbo@latest -e design-system`)
   - Geeignet für frühe Monorepo-Skalierung mit mehreren Apps/Packages
   - Höherer Initialaufwand im Vergleich zu Vite-only Start

3. **TSDX 2.0** (`bunx tsdx create ...`)
   - Moderne Bun-first Option
   - Solide Library-Ausrichtung, aber stärkere Bun-Bindung

### Selected Starter: Vite React-TS Starter

**Rationale for Selection:**
Passend zum Zielbild (React/TypeScript, breite Tooling-Kompatibilität, hohe Wartbarkeit), leichtgewichtig als Foundation und ohne unnötigen Lock-in.

**Initialization Command:**

```bash
npm create vite@latest react-md3 -- --template react-ts
```

**Architectural Decisions Provided by Starter:**

**Language & Runtime:**
TypeScript + React als Standardfundament, inklusive TS-Konfiguration.

**Styling Solution:**
Kein starker Styling-Lock-in; flexibel für Token-/Theme-System.

**Build Tooling:**
Vite-Toolchain mit schneller Dev-Experience; Build basiert auf Rollup. Für Library-Output wird Library-Mode konfiguriert.

**Testing Framework:**
Starter enthält kein vollständiges Testsystem; Vitest/RTL/Playwright werden als unmittelbarer Follow-up-Standard ergänzt.

**Code Organization:**
Start mit `src`-Struktur, dann Umstellung auf library-zentrierte Struktur (`src/components`, `src/index.ts`).

**Development Experience:**
Schneller Dev-Server/HMR, einfache Skripts, niedrige Einstiegshürde.

### Scale Trigger for Monorepo Evolution

Wechselpfad zu Turborepo wird aktiviert, wenn mindestens zwei Bedingungen eintreten:
- Mehr als eine konsumierende App + separates Docs/Playground
- Shared Packages (z. B. tokens, utils, lint-config) mit eigenem Lifecycle
- CI-Laufzeiten/Dependency-Graph machen isolierte Package-Builds notwendig

**Note:** Project initialization using this command should be the first implementation story.

## Core Architectural Decisions

### Decision Priority Analysis

**Critical Decisions (Block Implementation):**
- Token-first Data Architecture ohne Runtime-DB
- Package-API-first (kein REST/GraphQL-MVP)
- Security-Baseline: npm Provenance + least-privilege CI + Dependency Scans
- Infrastrukturstandard: Node.js LTS 24.14.0, pnpm 10.30.2, Changesets 2.29.8, GitHub Actions
- Verbindliche Kompatibilitätsmatrix als Release-Gate

**Important Decisions (Shape Architecture):**
- Frontend-Architektur: composable Komponenten + local state (kein globales State-Framework im MVP)
- Doku/Test-Stack: Storybook 10.2.12, Vitest 4.0.18, Playwright 1.58.2
- Release-Channel-Modell: canary/prerelease + stable
- Scope-Governance: nur M3-relevante Features im MVP
- Monorepo sofort: Workspace-basiertes Setup mit apps/ + packages/

**Deferred Decisions (Post-MVP):**
- Optionale Service-APIs (REST/GraphQL)

### Data Architecture

- Entscheidung: Token-first, keine Runtime-DB
- Technologien: `style-dictionary@5.2.0`, `@material/material-color-utilities@0.4.8`
- Rationale: Design-System-Konsistenz bei geringer Laufzeitkomplexität

### Authentication & Security

- Entscheidung: Kein Endnutzer-Auth im Library-Core; Supply-Chain-Security-first
- Maßnahmen: npm Provenance, least-privilege CI, Dependency-Scanning

### API & Communication Patterns

- Entscheidung: Package-API-first (Exports + Typen), keine Runtime API im MVP

### Frontend Architecture

- Entscheidung: `react@19.2.4`, `typescript@5.9.3`, `vite@7.3.1`
- Muster: composable components, local state, tree-shake-freundliche Exports
- Qualität: `storybook@10.2.12`, `vitest@4.0.18`, `playwright@1.58.2`
- Merge-Gate: Unit + Interaction + E2E-Smoke + A11y-Nachweis

### Infrastructure & Deployment

- Entscheidung: GitHub Actions + Changesets + npm Publish (Provenance)
- Laufzeit/Tooling: Node.js LTS `24.14.0`, pnpm `10.30.2`
- Release-Policy: canary/prerelease für Risikoabsicherung vor stable

### Decision Impact Analysis

**Implementation Sequence:**
1. Token-Pipeline + Library-Mode Build
2. Kompatibilitätsmatrix + CI/Release-Gates
3. Komponentenarchitektur + Export-Kontrakte
4. Storybook/Test/A11y-Gates pro Komponente

**Cross-Component Dependencies:**
- Tokenmodell steuert Komponenten-API und Theming
- Kompatibilitätsmatrix beeinflusst CI-Matrix und Release-Freigaben
- Release-Channels reduzieren Risiko bei API-Änderungen

## Implementation Patterns & Consistency Rules

### Pattern Categories Defined

**Critical Conflict Points Identified:**
18 Bereiche, in denen AI-Agents ohne Regeln inkonsistent implementieren könnten.

### Naming Patterns

**Database Naming Conventions:**
- Kein Runtime-DB im MVP.
- Falls später eingeführt: Tabellen `snake_case` plural, Spalten `snake_case`, FKs `<entity>_id`.

**API Naming Conventions:**
- Für optionale spätere Services: Routen plural + kebab-case, Params/Queries camelCase.

**Code Naming Conventions:**
- Komponenten/Dateien PascalCase, Hooks/Funktionen camelCase, Konstanten UPPER_SNAKE_CASE.
- Nicht-Komponenten-Ordner kebab-case.

### Structure Patterns

**Project Organization:**
- Komponenten co-located pro Ordner mit `Component.tsx`, `Component.test.tsx`, `Component.stories.tsx`, `index.ts`.
- Shared Helpers in `src/lib/`, öffentliche Exports nur über `src/index.ts`.

**Internal File Order (pro Komponente):**
1. `types.ts`
2. `constants.ts`
3. `Component.tsx`
4. `index.ts`

### Format Patterns

**API Response Formats (optionale Services):**
- Erfolg: `{ data, meta }`
- Fehler: `{ error: { code, message, details? } }`
- Datum/Zeit: ISO-8601 UTC-Strings.

**Data Exchange Formats:**
- JSON camelCase, Booleans true/false, explizite Nullability.

### Communication Patterns

**Event System Patterns:**
- `domain.entity.action` (lowercase dot-notation), Payload mit `version`, `timestamp`, `source`.

**State Management Patterns:**
- Immutable Updates, `status`-Union für Async, Loading-Flag als `isLoading`.

### Process Patterns

**Error Handling Patterns:**
- Keine silent failures, Fehlerobjekte mit `code` + `message`, klare Trennung user-facing vs technische Logs.

**Loading State Patterns:**
- Lokal bevorzugt, global nur bei echten cross-cutting Prozessen; Skeleton-first statt Spinner-only.

### Enforcement Guidelines

**All AI Agents MUST:**
- Exporte nur über `src/index.ts` ändern.
- Neue Komponenten mit Test + Story + Usage-Beispiel liefern.
- Naming/Strukturregeln strikt einhalten.

**Quality Minimum for New Components:**
- Mindestens 1 Happy-Path-Test
- Mindestens 1 A11y- oder Edge-Case-Test

**Pattern Enforcement:**
- CI-Gates: Lint, Test, Build.
- PR-Verstöße vor Merge beheben.
- Abweichungen nur mit dokumentiertem ADR-Eintrag.

### Pattern Examples

**Good Examples:**
- `src/components/Button/Button.tsx` + `Button.test.tsx` + `Button.stories.tsx`
- Barrel-Export nur über `src/index.ts`
- Event: `tokens.palette.generated`

**Anti-Patterns:**
- Gemischte Dateinotation (`button.tsx` neben `Card.tsx`)
- Verstreute Exports
- Stille Fehlerbehandlung ohne strukturiertes Fehlerobjekt

## Project Structure & Boundaries

### Complete Project Directory Structure

```text
react-md3/
├── README.md
├── package.json
├── pnpm-workspace.yaml
├── pnpm-lock.yaml
├── turbo.json
├── tsconfig.base.json
├── .changeset/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       └── release.yml
├── apps/
│   ├── docs/
│   ├── playground/
│   └── examples/
├── packages/
│   ├── ui/
│   ├── tokens/
│   ├── test-utils/
│   ├── eslint-config/
│   ├── tsconfig/
│   └── config/
├── tests/
│   ├── e2e/
│   ├── integration/
│   └── contracts/
├── docs/
│   ├── architecture/
│   ├── adr/
│   └── migrations/
└── scripts/
```

### Architectural Boundaries

- Public API ausschließlich über `packages/ui/src/index.ts` und `packages/tokens/src/index.ts`.
- Keine Deep Imports zwischen Komponenten/Packages.
- Token-Source-of-Truth nur in `packages/tokens/src/source`.
- Build- und Release-Governance zentral im Root.

### Requirements to Structure Mapping

- Komponentenlieferung: `packages/ui/src/components/*`
- Doku/Beispiele: `apps/docs`, `apps/examples`, Stories
- API-Lifecycle/SemVer: `.changeset/`, `tests/contracts/`, `docs/migrations/`
- Quality Gates: `tests/*`, `.github/workflows/*`, `scripts/verify-*`

### Integration Points

- Interne Integration: `ui` konsumiert `tokens` via Workspace-Pakete.
- Externe Integration: npm Publish (Provenance), GitHub Actions, Storybook/Playwright.
- Datenfluss: Token Source -> Token Build -> UI Components -> Docs/Examples.

## Architecture Validation Results

### Coherence Validation ✅

- Entscheidungen konsistent, Versionen kompatibel, Monorepo aktiv.

### Requirements Coverage Validation ✅

- FR/NFR-Deckung vollständig im Zielbild.

### Implementation Readiness Validation ✅

- Pattern- und Strukturregeln ausreichend konkret für Multi-Agent-Implementierung.

### Validation Issues Addressed

- Monorepo als aktive Entscheidung konsolidiert.
- Public API strikt nur über Barrel-Exports (No-Exception).
- Release-Blocker bestätigt: Contract + Unit + A11y-Smoke.
- Implementierungsstart als vertikale Scheibe: Token build -> 1 Kernkomponente -> Story + Tests.

### Architecture Readiness Assessment

**Overall Status:** READY FOR IMPLEMENTATION
**Confidence Level:** High
