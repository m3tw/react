import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = dirname(fileURLToPath(import.meta.url))
const packageRoot = resolve(scriptDir, '..')

const readText = (relativePath) => readFileSync(resolve(packageRoot, relativePath), 'utf8')

const fail = (message) => {
  throw new Error(message)
}

const stableStringify = (value) => {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`
  }

  if (value && typeof value === 'object') {
    const entries = Object.entries(value).sort(([left], [right]) =>
      left.localeCompare(right),
    )
    return `{${entries
      .map(([key, child]) => `${JSON.stringify(key)}:${stableStringify(child)}`)
      .join(',')}}`
  }

  return JSON.stringify(value)
}

const parseNamedSpec = (rawNames) =>
  rawNames
    .split(',')
    .map((entry) => entry.trim().replace(/^type\s+/, ''))
    .filter(Boolean)
    .map((entry) => {
      const parts = entry.split(/\s+as\s+/)
      return parts[parts.length - 1]
    })

const resolveModulePath = (fromFile, request) => {
  const basePath = resolve(dirname(fromFile), request)
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.tsx`,
    `${basePath}.js`,
    `${basePath}.mjs`,
    resolve(basePath, 'index.ts'),
    resolve(basePath, 'index.tsx'),
    resolve(basePath, 'index.js'),
    resolve(basePath, 'index.mjs'),
  ]

  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) {
      return candidate
    }
  }

  fail(`Konnte Export-Pfad nicht aufloesen: "${request}" aus ${fromFile}`)
}

const collectExports = (filePath, visited = new Set()) => {
  if (visited.has(filePath)) {
    return new Set()
  }
  visited.add(filePath)

  const source = readFileSync(filePath, 'utf8')
  const symbols = new Set()

  for (const match of source.matchAll(
    /^\s*export\s+(?:declare\s+)?(?:const|function|class|type|interface|enum)\s+([A-Za-z0-9_]+)/gm,
  )) {
    symbols.add(match[1])
  }

  for (const match of source.matchAll(
    /^\s*export\s*{\s*([^}]+)\s*}(?:\s*from\s*['"]([^'"]+)['"])?/gm,
  )) {
    const rawNames = match[1]
    const exportNames = parseNamedSpec(rawNames)
    for (const name of exportNames) {
      symbols.add(name)
    }
  }

  for (const match of source.matchAll(/^\s*export\s+\*\s+from\s+['"]([^'"]+)['"]/gm)) {
    const request = match[1]
    if (!request.startsWith('.')) {
      continue
    }
    const targetFile = resolveModulePath(filePath, request)
    for (const symbol of collectExports(targetFile, visited)) {
      symbols.add(symbol)
    }
  }

  return symbols
}

const contract = JSON.parse(readText('public-api.contract.json'))
const packageJson = JSON.parse(readText('package.json'))

const publicSurface = contract.publicSurface
if (!publicSurface) {
  fail('publicSurface fehlt im API-Vertrag.')
}

const documentedExports = [...(publicSurface.exports ?? [])].sort()
if (documentedExports.length === 0) {
  fail('publicSurface.exports darf nicht leer sein.')
}

const packageExports = packageJson.exports ?? {}
const packageDotExport = packageExports['.']
if (!packageDotExport || typeof packageDotExport !== 'object') {
  fail('package.json muss einen "." Export mit import/types fuer die Public API definieren.')
}

const expectedEntrypoint = `./${publicSurface.entrypoint}`
if (
  packageDotExport.import !== expectedEntrypoint ||
  packageDotExport.types !== expectedEntrypoint
) {
  fail(
    `package.json exports "." muss auf ${expectedEntrypoint} zeigen (import/types).`,
  )
}

const hasDeepSubpathExports = Object.keys(packageExports).some(
  (key) => key !== '.',
)
if (publicSurface.allowDeepImports === false && hasDeepSubpathExports) {
  fail(
    'allowDeepImports=false, aber package.json enthaelt zusaetzliche Subpath-Exports.',
  )
}

const deprecationPolicy = contract.deprecationPolicy
if (!deprecationPolicy) {
  fail('deprecationPolicy fehlt im API-Vertrag.')
}

const requiredLifecycle = ['active', 'deprecated', 'removed']
if (
  JSON.stringify(deprecationPolicy.lifecycle ?? []) !==
  JSON.stringify(requiredLifecycle)
) {
  fail(
    `deprecationPolicy.lifecycle muss exakt ${requiredLifecycle.join(
      ' -> ',
    )} sein.`,
  )
}

if (
  !Number.isInteger(deprecationPolicy.minimumAdvanceNoticeMinorReleases) ||
  deprecationPolicy.minimumAdvanceNoticeMinorReleases < 1
) {
  fail('minimumAdvanceNoticeMinorReleases muss eine ganze Zahl >= 1 sein.')
}

if (
  !Array.isArray(deprecationPolicy.communicationChannels) ||
  deprecationPolicy.communicationChannels.length === 0
) {
  fail('communicationChannels muss mindestens einen Kommunikationskanal enthalten.')
}

const semverMapping = deprecationPolicy.semverMapping ?? {}
for (const versionKey of ['patch', 'minor', 'major']) {
  if (typeof semverMapping[versionKey] !== 'string' || semverMapping[versionKey].trim() === '') {
    fail(`semverMapping.${versionKey} fehlt oder ist leer.`)
  }
}

if (deprecationPolicy.migrationGuidanceRequired !== true) {
  fail('migrationGuidanceRequired muss true sein.')
}

const actualExports = [
  ...collectExports(resolve(packageRoot, publicSurface.entrypoint)),
].sort()

if (JSON.stringify(actualExports) !== JSON.stringify(documentedExports)) {
  fail(
    `Public API weicht vom Vertrag ab.\nDokumentiert: ${documentedExports.join(
      ', ',
    )}\nAktuell: ${actualExports.join(', ')}`,
  )
}

const releaseTraceability = contract.releaseTraceability ?? {}
const release = releaseTraceability.currentRelease
if (!release) {
  fail('releaseTraceability.currentRelease fehlt im API-Vertrag.')
}

for (const metadataField of releaseTraceability.requiredMetadata ?? []) {
  const value = release[metadataField]
  const emptyString = typeof value === 'string' && value.trim() === ''
  const emptyList = Array.isArray(value) && value.length === 0
  if (value === undefined || value === null || emptyString || emptyList) {
    fail(`Pflichtmetadatum fehlt oder ist leer: ${metadataField}`)
  }
}

const releaseExports = [...(release.affectedExports ?? [])].sort()
if (JSON.stringify(releaseExports) !== JSON.stringify(documentedExports)) {
  fail('affectedExports stimmt nicht mit dem dokumentierten Public Surface ueberein.')
}

const hashSnapshot = {
  contractVersion: contract.contractVersion,
  publicSurface: {
    ...publicSurface,
    exports: documentedExports,
  },
  deprecationPolicy,
  releaseTraceability: {
    ...releaseTraceability,
    currentRelease: {
      ...release,
      changelogToken: undefined,
    },
  },
}
delete hashSnapshot.releaseTraceability.currentRelease.changelogToken

const expectedHash = createHash('sha256')
  .update(stableStringify(hashSnapshot))
  .digest('hex')

if (contract.contractHash !== expectedHash) {
  fail(
    `contractHash stimmt nicht. Erwartet: ${expectedHash}, gefunden: ${contract.contractHash}`,
  )
}

const expectedToken = `[api-contract-hash:${expectedHash}]`
if (release.changelogToken !== expectedToken) {
  fail(
    `changelogToken stimmt nicht. Erwartet: ${expectedToken}, gefunden: ${release.changelogToken}`,
  )
}

const changelog = readText('CHANGELOG.md')
if (!changelog.includes(expectedToken)) {
  fail(`CHANGELOG.md enthaelt den erforderlichen Token nicht: ${expectedToken}`)
}

for (const metadataField of releaseTraceability.requiredMetadata ?? []) {
  if (!changelog.includes(`${metadataField}:`)) {
    fail(`CHANGELOG.md enthaelt das Pflichtmetadatum nicht: ${metadataField}`)
  }
}

if (!release.migrationGuide || release.migrationGuide.trim() === '') {
  fail('migrationGuide ist leer; Migrationshinweise sind verpflichtend.')
}

console.log(`API contract check passed (${expectedHash}).`)
