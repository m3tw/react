import { spawnSync } from 'node:child_process'

const simulatedFailures = {
  'setup-fehler':
    '[setup-fehler] Simulierter Setup-Fehler: Dependency-Installation unvollstaendig oder Tooling nicht verfuegbar.',
  'toolchain-drift':
    '[toolchain-drift] Simulierter Toolchain-Drift: Build bricht aufgrund inkonsistenter Toolchain-Versionen.',
  'api-regression':
    '[api-regression] Simulierte API-Regression: Public API Smoke-Test faellt gegen den aktuellen Export-Surface.',
}

const forcedFailure = process.env.REFERENCE_FAIL_MODE

if (forcedFailure) {
  const message = simulatedFailures[forcedFailure]
  if (!message) {
    console.error(
      `Unknown REFERENCE_FAIL_MODE "${forcedFailure}". Allowed: ${Object.keys(simulatedFailures).join(', ')}`,
    )
    process.exit(2)
  }

  console.error(message)
  process.exit(1)
}

const runStep = (label, category, command) => {
  const result = spawnSync(command, {
    shell: true,
    stdio: 'inherit',
  })

  if (result.status !== 0) {
    console.error(`[${category}] ${label} fehlgeschlagen.`)
    process.exit(result.status ?? 1)
  }
}

runStep('Build reference integration', 'toolchain-drift', 'npm run build')
runStep('Test public API smoke', 'api-regression', 'npm run test')

console.log(
  'Reference integration smoke passed. Fehlerklassifikation: setup-fehler (install), toolchain-drift (build), api-regression (test).',
)
