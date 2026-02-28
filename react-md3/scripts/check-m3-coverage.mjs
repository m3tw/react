import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(scriptDir, '..')

const fail = (message) => {
  throw new Error(message)
}

const parseJson = (relativePath) =>
  JSON.parse(readFileSync(resolve(packageRoot, relativePath), 'utf8'))

const reportFlagIndex = process.argv.indexOf('--report')
const reportPath = reportFlagIndex >= 0 ? process.argv[reportFlagIndex + 1] : null

if (reportFlagIndex >= 0 && !reportPath) {
  fail('Missing value for --report argument.')
}

const referenceList = parseJson('scripts/m3-reference-list.json')
const matrix = parseJson('scripts/m3-coverage-matrix.json')
const contract = parseJson('public-api.contract.json')

if (!Array.isArray(referenceList) || referenceList.length !== 42) {
  fail(`m3-reference-list.json must contain exactly 42 entries. Found: ${referenceList.length ?? 'invalid'}`)
}

if (!Array.isArray(matrix.mappingRules) || matrix.mappingRules.length === 0) {
  fail('m3-coverage-matrix.json must define non-empty mappingRules.')
}

const mappingRuleIds = new Set(
  matrix.mappingRules
    .map((rule) => rule?.id)
    .filter((value) => typeof value === 'string' && value.trim() !== ''),
)

if (mappingRuleIds.size !== matrix.mappingRules.length) {
  fail('mappingRules require unique non-empty ids.')
}

if (!Array.isArray(matrix.entries) || matrix.entries.length !== referenceList.length) {
  fail(
    `m3-coverage-matrix.json entries must match canonical reference length (${referenceList.length}). Found: ${
      matrix.entries?.length ?? 'invalid'
    }`,
  )
}

const contractExports = new Set(contract?.publicSurface?.exports ?? [])
if (contractExports.size === 0) {
  fail('public-api.contract.json has no publicSurface.exports to validate coverage evidence.')
}

const entriesSorted = [...matrix.entries].sort((left, right) => left.referenceIndex - right.referenceIndex)
const seenIndices = new Set()
const seenCoverageKeys = new Map()
const labelGroups = new Map()
const gaps = []

for (const [position, entry] of entriesSorted.entries()) {
  const expectedIndex = position + 1

  if (!Number.isInteger(entry.referenceIndex)) {
    fail(`Entry at sorted position ${expectedIndex} has non-integer referenceIndex.`)
  }

  if (seenIndices.has(entry.referenceIndex)) {
    fail(`Duplicate referenceIndex detected: ${entry.referenceIndex}`)
  }
  seenIndices.add(entry.referenceIndex)

  if (entry.referenceIndex !== expectedIndex) {
    fail(`Missing or out-of-order referenceIndex. Expected ${expectedIndex}, got ${entry.referenceIndex}.`)
  }

  const expectedLabel = referenceList[position]
  if (entry.referenceLabel !== expectedLabel) {
    fail(
      `Reference label mismatch at index ${expectedIndex}. Expected "${expectedLabel}", got "${entry.referenceLabel}".`,
    )
  }

  if (!mappingRuleIds.has(entry.mappingRule)) {
    fail(`Unknown mappingRule "${entry.mappingRule}" at index ${expectedIndex}.`)
  }

  if (typeof entry.coverageKey !== 'string' || entry.coverageKey.trim() === '') {
    fail(`Entry ${expectedIndex} requires a non-empty coverageKey.`)
  }

  const mappingSet = seenCoverageKeys.get(entry.coverageKey) ?? new Set()
  mappingSet.add(entry.mappingRule)
  seenCoverageKeys.set(entry.coverageKey, mappingSet)

  const labelGroup = labelGroups.get(entry.referenceLabel) ?? []
  labelGroup.push(entry)
  labelGroups.set(entry.referenceLabel, labelGroup)

  if (entry.status === 'implemented') {
    const implementation = entry.implementation
    if (!implementation || typeof implementation !== 'object') {
      fail(`Entry ${expectedIndex} is implemented but missing implementation metadata.`)
    }

    if (!Array.isArray(implementation.exports) || implementation.exports.length === 0) {
      fail(`Entry ${expectedIndex} requires at least one export in implementation.exports.`)
    }

    for (const exportName of implementation.exports) {
      if (!contractExports.has(exportName)) {
        fail(`Entry ${expectedIndex} references unknown export "${exportName}".`)
      }
    }

    if (typeof implementation.standardExample !== 'string' || implementation.standardExample.trim() === '') {
      fail(`Entry ${expectedIndex} requires implementation.standardExample.`)
    }

    if (typeof implementation.edgeExample !== 'string' || implementation.edgeExample.trim() === '') {
      fail(`Entry ${expectedIndex} requires implementation.edgeExample.`)
    }

    if (!Array.isArray(implementation.tests) || implementation.tests.length === 0) {
      fail(`Entry ${expectedIndex} requires implementation.tests with at least one test path.`)
    }

    for (const testPath of implementation.tests) {
      const resolvedTest = resolve(packageRoot, testPath)
      if (!existsSync(resolvedTest)) {
        fail(`Entry ${expectedIndex} references missing test evidence file: ${testPath}`)
      }
    }

    continue
  }

  if (entry.status === 'gap') {
    if (typeof entry.priority !== 'string' || entry.priority.trim() === '') {
      fail(`Gap entry ${expectedIndex} requires a non-empty priority.`)
    }

    if (!entry.gapPlan || typeof entry.gapPlan !== 'string' || entry.gapPlan.trim() === '') {
      fail(`Gap entry ${expectedIndex} requires a non-empty gapPlan.`)
    }

    gaps.push(entry)
    continue
  }

  fail(`Entry ${expectedIndex} has invalid status "${entry.status}". Allowed: implemented|gap.`)
}

for (const [label, entries] of labelGroups.entries()) {
  if (entries.length <= 1) {
    continue
  }

  const baseline = entries[0]
  for (const entry of entries.slice(1)) {
    if (entry.coverageKey !== baseline.coverageKey || entry.mappingRule !== baseline.mappingRule) {
      fail(
        `Ambiguous duplicate label mapping for "${label}": duplicate rows must keep same coverageKey and mappingRule.`,
      )
    }
  }
}

for (const [coverageKey, mappingSet] of seenCoverageKeys.entries()) {
  if (mappingSet.size > 1) {
    fail(
      `Coverage key "${coverageKey}" is assigned by multiple mapping rules (${[
        ...mappingSet,
      ].join(', ')}). This is treated as ambiguous/double-counted mapping.`,
    )
  }
}

const implementedCount = entriesSorted.filter((entry) => entry.status === 'implemented').length
const gapCount = entriesSorted.filter((entry) => entry.status === 'gap').length
const totalCount = entriesSorted.length

const reportLines = [
  '# M3 Coverage Baseline Report',
  '',
  `- Generated: ${new Date().toISOString()}`,
  `- Canonical source: ${matrix.source?.path ?? 'unknown'}`,
  `- Implemented: ${implementedCount}/${totalCount}`,
  `- Open gaps: ${gapCount}`,
  '',
  '## Summary',
  '',
  gapCount === 0
    ? '- 42/42 entries are implemented. No open rest gaps remain.'
    : '- Open gaps remain. See details below.',
  '',
  '## Coverage Matrix',
  '',
  '| # | Reference entry | Status | Mapping rule | Evidence |',
  '| --- | --- | --- | --- | --- |',
]

for (const entry of entriesSorted) {
  const evidence =
    entry.status === 'implemented'
      ? (entry.implementation?.exports ?? []).join(', ')
      : `${entry.priority}: ${entry.gapPlan}`
  reportLines.push(
    `| ${entry.referenceIndex} | ${entry.referenceLabel} | ${entry.status} | ${entry.mappingRule} | ${evidence} |`,
  )
}

if (gapCount > 0) {
  reportLines.push('', '## Open Rest Gaps (Priority + Plan)', '')
  for (const gap of gaps) {
    reportLines.push(
      `- [${gap.priority}] ${gap.referenceLabel}: ${gap.gapPlan}`,
    )
  }
}

if (reportPath) {
  const resolvedReportPath = resolve(packageRoot, reportPath)
  mkdirSync(dirname(resolvedReportPath), { recursive: true })
  writeFileSync(resolvedReportPath, `${reportLines.join('\n')}\n`, 'utf8')
  console.log(`Coverage report written: ${reportPath}`)
}

if (implementedCount !== totalCount || gapCount > 0) {
  fail(`Coverage check failed: ${implementedCount}/${totalCount} implemented, ${gapCount} gaps open.`)
}

console.log(`M3 coverage check passed (${implementedCount}/${totalCount} implemented).`)
