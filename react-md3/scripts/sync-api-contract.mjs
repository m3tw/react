import { createHash } from 'node:crypto'
import { existsSync, readFileSync, statSync, writeFileSync } from 'node:fs'
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
    const entries = Object.entries(value).sort(([left], [right]) => left.localeCompare(right))
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

const replaceFirst = (source, pattern, replacement, description) => {
  if (!pattern.test(source)) {
    fail(`Konnte ${description} in CHANGELOG.md nicht finden.`)
  }
  return source.replace(pattern, replacement)
}

const contractPath = resolve(packageRoot, 'public-api.contract.json')
const changelogPath = resolve(packageRoot, 'CHANGELOG.md')
const contract = JSON.parse(readText('public-api.contract.json'))

if (!contract.publicSurface?.entrypoint) {
  fail('publicSurface.entrypoint fehlt im API-Vertrag.')
}

if (!contract.releaseTraceability?.currentRelease) {
  fail('releaseTraceability.currentRelease fehlt im API-Vertrag.')
}

const actualExports = [...collectExports(resolve(packageRoot, contract.publicSurface.entrypoint))].sort()

contract.publicSurface.exports = actualExports
contract.releaseTraceability.currentRelease.affectedExports = actualExports

const hashSnapshot = {
  contractVersion: contract.contractVersion,
  publicSurface: {
    ...contract.publicSurface,
    exports: actualExports,
  },
  deprecationPolicy: contract.deprecationPolicy,
  releaseTraceability: {
    ...contract.releaseTraceability,
    currentRelease: {
      ...contract.releaseTraceability.currentRelease,
      changelogToken: undefined,
    },
  },
}
delete hashSnapshot.releaseTraceability.currentRelease.changelogToken

const expectedHash = createHash('sha256').update(stableStringify(hashSnapshot)).digest('hex')
const expectedToken = `[api-contract-hash:${expectedHash}]`

contract.releaseTraceability.currentRelease.changelogToken = expectedToken
contract.contractHash = expectedHash

writeFileSync(contractPath, `${JSON.stringify(contract, null, 2)}\n`, 'utf8')

const release = contract.releaseTraceability.currentRelease
const expectedLines = [
  `- changeType: ${release.changeType}`,
  `- affectedExports: ${release.affectedExports.join(', ')}`,
  `- riskLevel: ${release.riskLevel}`,
  `- migrationGuide: ${release.migrationGuide}`,
]

let changelog = readFileSync(changelogPath, 'utf8')
changelog = replaceFirst(changelog, /\[api-contract-hash:[0-9a-f]{64}\]/, expectedToken, 'API-Contract-Hash-Token')
changelog = replaceFirst(changelog, /^- changeType: .*$/m, expectedLines[0], 'changeType Metadaten')
changelog = replaceFirst(changelog, /^- affectedExports: .*$/m, expectedLines[1], 'affectedExports Metadaten')
changelog = replaceFirst(changelog, /^- riskLevel: .*$/m, expectedLines[2], 'riskLevel Metadaten')
changelog = replaceFirst(changelog, /^- migrationGuide: .*$/m, expectedLines[3], 'migrationGuide Metadaten')
writeFileSync(changelogPath, changelog, 'utf8')

console.log(`API contract synchronized (${expectedHash}).`)
