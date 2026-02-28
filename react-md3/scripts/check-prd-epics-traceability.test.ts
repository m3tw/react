import { describe, expect, it } from 'vitest'

import { validateTraceability } from './check-prd-epics-traceability.mjs'

const matrix = {
  schemaVersion: 1,
  consistencyRules: {
    requiredFrIds: ['FR1', 'FR13', 'FR14', 'FR15'],
    requiredNfrIds: ['NFR13', 'NFR14'],
  },
  frMappings: [
    { id: 'FR1', expectedEpic: 'Epic 2 - Vollstaendige M3-Komponentenabdeckung' },
    {
      id: 'FR13',
      expectedEpic: 'Epic 1 - Zugriff auf API-Beschreibung je Referenzlisten-Komponente',
    },
    {
      id: 'FR14',
      expectedEpic: 'Epic 1 - Praxisnahe Standardbeispiele je Referenzlisten-Komponente',
    },
    { id: 'FR15', expectedEpic: 'Epic 2 - Edge-Case-/Fehlerfallbeispiele je Referenzlisten-Komponente' },
    { id: 'FR21', expectedEpic: 'Epic 4 - Release-Bewertung gegen Qualitaetskriterien' },
    { id: 'FR23', expectedEpic: 'Epic 4 - API- und Beispielkonsistenz vor Release pruefen' },
    { id: 'FR24', expectedEpic: 'Epic 4 - Go/No-Go-Steuerung fuer Phasenuebergaenge' },
  ],
  nfrMappings: [
    {
      id: 'NFR13',
      prdSnippet: 'barrierearme Nutzung',
      epicsSnippet: 'barrierearme Nutzung',
    },
    {
      id: 'NFR14',
      prdSnippet: 'Accessibility-Abdeckung',
      epicsSnippet: 'Accessibility-Abdeckung',
    },
  ],
  kpiMappings: [
    {
      id: 'KPI 1',
      prdSnippet: 'Anzahl aktiver Projekte',
      epicsLinks: ['FR28: Epic 5 - Bewertung aktiver Nutzung', '### Story 5.3: KPI-Tracking'],
    },
  ],
}

const prdContent = `
- FR1: foo
- FR13: foo
- FR14: foo
- FR15: foo
- FR21: foo
- FR23: foo
- FR24: foo
- KPI 1: Anzahl aktiver Projekte (monatlich).
- Dokumentation enthält Hinweise für barrierearme Nutzung der Komponenten der Material-3-Komponenten-Referenzliste.
- Komponenten der Material-3-Komponenten-Referenzliste müssen eine explizit dokumentierte Accessibility-Abdeckung aufweisen.
`

const epicsContent = `
FR1: Epic 2 - Vollstaendige M3-Komponentenabdeckung
FR13: Epic 1 - Zugriff auf API-Beschreibung je Referenzlisten-Komponente
FR14: Epic 1 - Praxisnahe Standardbeispiele je Referenzlisten-Komponente
FR15: Epic 2 - Edge-Case-/Fehlerfallbeispiele je Referenzlisten-Komponente
FR21: Epic 4 - Release-Bewertung gegen Qualitaetskriterien
FR23: Epic 4 - API- und Beispielkonsistenz vor Release pruefen
FR24: Epic 4 - Go/No-Go-Steuerung fuer Phasenuebergaenge
NFR13: Dokumentation enthaelt Hinweise fuer barrierearme Nutzung der Komponenten der Material-3-Komponenten-Referenzliste.
NFR14: Komponenten der Material-3-Komponenten-Referenzliste muessen eine explizit dokumentierte Accessibility-Abdeckung aufweisen.
FR28: Epic 5 - Bewertung aktiver Nutzung
### Story 5.3: KPI-Tracking fuer Adoption und Time-to-Value etablieren
`

describe('check-prd-epics-traceability', () => {
  it('validates complete FR/NFR/KPI mappings', () => {
    const result = validateTraceability({
      matrix,
      prdContent,
      epicsContent,
    })

    expect(result.frChecked).toBe(7)
    expect(result.nfrChecked).toBe(2)
    expect(result.kpiChecked).toBe(1)
  })

  it('fails when a required FR mapping drifts', () => {
    const driftedEpics = epicsContent.replace('FR14: Epic 1', 'FR14: Epic 2')
    expect(() =>
      validateTraceability({
        matrix,
        prdContent,
        epicsContent: driftedEpics,
      }),
    ).toThrow('FR14')
  })

  it('fails when KPI links are missing', () => {
    const driftedEpics = epicsContent.replace('FR28: Epic 5 - Bewertung aktiver Nutzung', '')
    expect(() =>
      validateTraceability({
        matrix,
        prdContent,
        epicsContent: driftedEpics,
      }),
    ).toThrow('KPI 1')
  })
})
