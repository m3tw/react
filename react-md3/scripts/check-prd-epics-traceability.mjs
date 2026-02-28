import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(scriptDir, '..')

const fail = (message) => {
  throw new Error(message)
}

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const readText = (basePath, relativePath) => {
  const resolvedPath = resolve(basePath, relativePath)
  if (!existsSync(resolvedPath)) {
    fail(`Pflichtquelle nicht gefunden: ${relativePath} (${resolvedPath})`)
  }

  return {
    path: resolvedPath,
    content: readFileSync(resolvedPath, 'utf8'),
  }
}

const assertUniqueIds = (entries, type) => {
  const seen = new Set()
  for (const entry of entries) {
    const id = entry?.id
    if (typeof id !== 'string' || id.trim() === '') {
      fail(`${type}: Jede Mapping-Definition braucht eine nicht-leere id.`)
    }
    if (seen.has(id)) {
      fail(`${type}: Doppelte id erkannt: ${id}`)
    }
    seen.add(id)
  }
}

const collectPrdFrIds = (prdContent) => {
  const ids = new Set()
  for (const match of prdContent.matchAll(/^- (FR\d+):/gm)) {
    ids.add(match[1])
  }
  return ids
}

const findPrdKpiLine = (prdContent, kpiId) => {
  const pattern = new RegExp(`^- ${escapeRegExp(kpiId)}:\\s+(.+)$`, 'm')
  return prdContent.match(pattern)?.[1] ?? null
}

const findEpicsLine = (epicsContent, id) => {
  const pattern = new RegExp(`^${escapeRegExp(id)}:\\s+(.+)$`, 'm')
  return epicsContent.match(pattern)?.[1] ?? null
}

const asStringArray = (value, label) => {
  if (!Array.isArray(value) || value.length === 0) {
    fail(`${label} muss eine nicht-leere Liste sein.`)
  }

  for (const item of value) {
    if (typeof item !== 'string' || item.trim() === '') {
      fail(`${label} enthaelt einen ungueltigen Eintrag.`)
    }
  }

  return value
}

export const validateTraceability = ({ matrix, prdContent, epicsContent }) => {
  if (!matrix || typeof matrix !== 'object') {
    fail('Traceability-Matrix fehlt oder ist ungueltig.')
  }

  if (matrix.schemaVersion !== 1) {
    fail(`Nicht unterstuetzte Matrix-Version: ${matrix.schemaVersion ?? 'unbekannt'}`)
  }

  const frMappings = matrix.frMappings
  const nfrMappings = matrix.nfrMappings
  const kpiMappings = matrix.kpiMappings

  if (!Array.isArray(frMappings) || frMappings.length === 0) {
    fail('frMappings muss definiert und nicht leer sein.')
  }
  if (!Array.isArray(nfrMappings) || nfrMappings.length === 0) {
    fail('nfrMappings muss definiert und nicht leer sein.')
  }
  if (!Array.isArray(kpiMappings) || kpiMappings.length === 0) {
    fail('kpiMappings muss definiert und nicht leer sein.')
  }

  assertUniqueIds(frMappings, 'frMappings')
  assertUniqueIds(nfrMappings, 'nfrMappings')
  assertUniqueIds(kpiMappings, 'kpiMappings')

  const prdFrIds = collectPrdFrIds(prdContent)
  const requiredFrIds = asStringArray(matrix.consistencyRules?.requiredFrIds, 'requiredFrIds')
  const requiredNfrIds = asStringArray(matrix.consistencyRules?.requiredNfrIds, 'requiredNfrIds')

  const frMappingIds = new Set(frMappings.map((mapping) => mapping.id))
  const nfrMappingIds = new Set(nfrMappings.map((mapping) => mapping.id))

  for (const requiredFrId of requiredFrIds) {
    if (!frMappingIds.has(requiredFrId)) {
      fail(`Pflicht-FR ${requiredFrId} fehlt in frMappings.`)
    }
  }

  for (const requiredNfrId of requiredNfrIds) {
    if (!nfrMappingIds.has(requiredNfrId)) {
      fail(`Pflicht-NFR ${requiredNfrId} fehlt in nfrMappings.`)
    }
  }

  for (const mapping of frMappings) {
    if (!/^FR\d+$/.test(mapping.id)) {
      fail(`Ungueltige FR-ID in Matrix: ${mapping.id}`)
    }
    if (typeof mapping.expectedEpic !== 'string' || mapping.expectedEpic.trim() === '') {
      fail(`FR-Mapping ${mapping.id} braucht expectedEpic.`)
    }

    if (!prdFrIds.has(mapping.id)) {
      fail(`PRD enthaelt die FR-ID ${mapping.id} nicht.`)
    }

    const expectedPattern = new RegExp(
      `^${escapeRegExp(mapping.id)}:\\s+${escapeRegExp(mapping.expectedEpic)}$`,
      'm',
    )

    if (!expectedPattern.test(epicsContent)) {
      fail(
        `FR-Drift erkannt: ${mapping.id} erwartet in epics.md "${mapping.expectedEpic}".`,
      )
    }
  }

  for (const mapping of nfrMappings) {
    if (!/^NFR\d+$/.test(mapping.id)) {
      fail(`Ungueltige NFR-ID in Matrix: ${mapping.id}`)
    }
    if (typeof mapping.prdSnippet !== 'string' || mapping.prdSnippet.trim() === '') {
      fail(`NFR-Mapping ${mapping.id} braucht prdSnippet.`)
    }
    if (typeof mapping.epicsSnippet !== 'string' || mapping.epicsSnippet.trim() === '') {
      fail(`NFR-Mapping ${mapping.id} braucht epicsSnippet.`)
    }

    if (!prdContent.includes(mapping.prdSnippet)) {
      fail(`PRD-Drift erkannt fuer ${mapping.id}: Snippet fehlt (${mapping.prdSnippet}).`)
    }

    const epicsLine = findEpicsLine(epicsContent, mapping.id)
    if (!epicsLine) {
      fail(`epics.md enthaelt ${mapping.id} nicht.`)
    }
    if (!epicsLine.includes(mapping.epicsSnippet)) {
      fail(
        `NFR-Drift erkannt fuer ${mapping.id}: epics.md enthaelt nicht das erwartete Snippet (${mapping.epicsSnippet}).`,
      )
    }
  }

  for (const mapping of kpiMappings) {
    if (!/^KPI\s+\d+$/.test(mapping.id)) {
      fail(`Ungueltige KPI-ID in Matrix: ${mapping.id}`)
    }
    if (typeof mapping.prdSnippet !== 'string' || mapping.prdSnippet.trim() === '') {
      fail(`KPI-Mapping ${mapping.id} braucht prdSnippet.`)
    }

    const epicsLinks = asStringArray(mapping.epicsLinks, `${mapping.id}.epicsLinks`)

    const prdLine = findPrdKpiLine(prdContent, mapping.id)
    if (!prdLine) {
      fail(`PRD enthaelt ${mapping.id} nicht.`)
    }
    if (!prdLine.includes(mapping.prdSnippet)) {
      fail(
        `KPI-Drift erkannt fuer ${mapping.id}: PRD-Zeile enthaelt nicht "${mapping.prdSnippet}".`,
      )
    }

    for (const link of epicsLinks) {
      if (!epicsContent.includes(link)) {
        fail(`KPI-Drift erkannt fuer ${mapping.id}: Epics-Link fehlt (${link}).`)
      }
    }
  }

  return {
    frChecked: frMappings.length,
    nfrChecked: nfrMappings.length,
    kpiChecked: kpiMappings.length,
    requiredFrChecked: requiredFrIds.length,
    requiredNfrChecked: requiredNfrIds.length,
  }
}

const writeReport = ({ reportPath, matrixPath, sources, result }) => {
  const lines = [
    '# PRD-Epics Traceability Report',
    '',
    `- Generated: ${new Date().toISOString()}`,
    `- Matrix: ${matrixPath}`,
    `- PRD: ${sources.prd}`,
    `- Epics: ${sources.epics}`,
    '',
    '## Validation Summary',
    '',
    `- FR mappings checked: ${result.frChecked}`,
    `- NFR mappings checked: ${result.nfrChecked}`,
    `- KPI mappings checked: ${result.kpiChecked}`,
    `- Hard blocker FR checks: ${result.requiredFrChecked}`,
    `- Hard blocker NFR checks: ${result.requiredNfrChecked}`,
    '',
    'Status: PASS',
    '',
  ]

  const resolvedReportPath = resolve(packageRoot, reportPath)
  mkdirSync(dirname(resolvedReportPath), { recursive: true })
  writeFileSync(resolvedReportPath, `${lines.join('\n')}\n`, 'utf8')
}

export const runTraceabilityCheck = ({ reportPath = null } = {}) => {
  const matrixRelativePath = 'scripts/prd-epics-traceability-matrix.json'
  const matrixRaw = readText(packageRoot, matrixRelativePath)
  const matrix = JSON.parse(matrixRaw.content)

  const prdRelativePath = matrix.sources?.prd
  const epicsRelativePath = matrix.sources?.epics
  if (typeof prdRelativePath !== 'string' || prdRelativePath.trim() === '') {
    fail('Matrix muss sources.prd definieren.')
  }
  if (typeof epicsRelativePath !== 'string' || epicsRelativePath.trim() === '') {
    fail('Matrix muss sources.epics definieren.')
  }

  const prd = readText(packageRoot, prdRelativePath)
  const epics = readText(packageRoot, epicsRelativePath)

  const result = validateTraceability({
    matrix,
    prdContent: prd.content,
    epicsContent: epics.content,
  })

  if (reportPath) {
    writeReport({
      reportPath,
      matrixPath: matrixRaw.path,
      sources: {
        prd: prd.path,
        epics: epics.path,
      },
      result,
    })
  }

  return result
}

const reportFlagIndex = process.argv.indexOf('--report')
const reportPath = reportFlagIndex >= 0 ? process.argv[reportFlagIndex + 1] : null

if (reportFlagIndex >= 0 && !reportPath) {
  fail('Missing value for --report argument.')
}

const scriptEntrypoint = process.argv[1] ? resolve(process.argv[1]) : null
if (scriptEntrypoint === fileURLToPath(import.meta.url)) {
  const result = runTraceabilityCheck({ reportPath })
  console.log(
    `PRD-Epics traceability check passed (${result.frChecked} FR, ${result.nfrChecked} NFR, ${result.kpiChecked} KPI).`,
  )
}
