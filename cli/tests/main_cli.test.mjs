import assert from 'node:assert/strict'
import test from 'node:test'

import { parseArguments, runCli } from '../dist/main.js'

async function captureOutput(callback) {
  const originalLog = console.log
  const originalError = console.error
  const stdout = []
  const stderr = []
  console.log = (...args) => stdout.push(args.join(' '))
  console.error = (...args) => stderr.push(args.join(' '))
  try {
    const code = await callback()
    return { code, stdout: stdout.join('\n'), stderr: stderr.join('\n') }
  } finally {
    console.log = originalLog
    console.error = originalError
  }
}

const isolatedEnv = {
  XDG_CONFIG_HOME: '/tmp/codojo-cli-command-tests',
}

test('parses version and help flags before command dispatch', () => {
  assert.deepEqual(parseArguments(['--version']), {
    command: 'tui',
    positional: [],
    options: { version: true },
  })
  assert.deepEqual(parseArguments(['-v']), {
    command: 'tui',
    positional: [],
    options: { version: true },
  })
  assert.deepEqual(parseArguments(['--help']), {
    command: 'tui',
    positional: [],
    options: { help: true },
  })
  assert.deepEqual(parseArguments(['login', '--no-browser', '--token-stdin']), {
    command: 'login',
    positional: [],
    options: { 'no-browser': true, 'token-stdin': true },
  })
})

test('version aliases print one consistent version and exit successfully', async () => {
  for (const args of [['--version'], ['-v'], ['version']]) {
    const result = await captureOutput(() => runCli(args, isolatedEnv))
    assert.equal(result.code, 0)
    assert.match(result.stdout, /^codojo \d+\.\d+\.\d+(?:-[^\s]+)?$/)
    assert.equal(result.stderr, '')
  }
})

test('help aliases exit successfully and contain the supported commands', async () => {
  for (const args of [['--help'], ['-h'], ['help']]) {
    const result = await captureOutput(() => runCli(args, isolatedEnv))
    assert.equal(result.code, 0)
    assert.match(result.stdout, /codojo version/)
    assert.match(result.stdout, /codojo doctor/)
    assert.equal(result.stderr, '')
  }
})

test('token arguments are rejected without printing the token', async () => {
  const result = await captureOutput(() => runCli(['login', 'secret-token'], isolatedEnv))
  assert.equal(result.code, 1)
  assert.match(result.stderr, /Ne passez pas le token/)
  assert.doesNotMatch(`${result.stdout}\n${result.stderr}`, /secret-token/)
})

test('unknown commands return a short error without exposing an endpoint', async () => {
  const result = await captureOutput(() => runCli(['not-a-command'], isolatedEnv))
  assert.equal(result.code, 1)
  assert.match(result.stderr, /Commande inconnue/)
  assert.doesNotMatch(result.stderr, /codojo\.ekodevs\.com|localhost/)
})

test('normal dashboard output does not expose the endpoint', async () => {
  const result = await captureOutput(() => runCli(['dashboard'], isolatedEnv))
  assert.equal(result.code, 0)
  assert.match(result.stdout, /Tableau de bord disponible/)
  assert.doesNotMatch(result.stdout, /codojo\.ekodevs\.com|localhost/)
})

test('doctor exposes only the selected environment unless URL output is requested', async () => {
  const result = await captureOutput(() =>
    runCli(['doctor'], {
      ...isolatedEnv,
      CODOJO_ENV: 'development',
    })
  )
  assert.equal(result.code, 0)
  assert.match(result.stdout, /Environnement : développement/)
  assert.doesNotMatch(result.stdout, /localhost|codojo\.ekodevs\.com/)

  const verbose = await captureOutput(() =>
    runCli(['doctor', '--print-url'], {
      ...isolatedEnv,
      CODOJO_ENV: 'development',
    })
  )
  assert.equal(verbose.code, 0)
  assert.match(verbose.stdout, /API : http:\/\/localhost:3333/)
})
