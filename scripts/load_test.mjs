const targetUrl = process.env.LOAD_URL || 'http://127.0.0.1:3333/health'
const concurrency = Number(process.env.LOAD_CONCURRENCY || 50)
const durationMs = Number(process.env.LOAD_DURATION_MS || 30_000)
const requestTimeoutMs = Number(process.env.LOAD_REQUEST_TIMEOUT_MS || 10_000)

const target = new URL(targetUrl)
const localHosts = new Set(['127.0.0.1', 'localhost', '::1'])
const isLocalTarget = localHosts.has(target.hostname)
const expectedConfirmation = isLocalTarget ? 'local' : 'explicit-remote'

if (process.env.LOAD_TEST_CONFIRM !== expectedConfirmation) {
  throw new Error(
    isLocalTarget
      ? 'Set LOAD_TEST_CONFIRM=local to run this load test locally.'
      : 'Remote load tests require LOAD_TEST_CONFIRM=explicit-remote after explicit approval.'
  )
}

if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 500) {
  throw new Error('LOAD_CONCURRENCY must be an integer between 1 and 500.')
}

if (!Number.isInteger(durationMs) || durationMs < 1_000 || durationMs > 300_000) {
  throw new Error('LOAD_DURATION_MS must be between 1000 and 300000.')
}

const startedAt = Date.now()
const deadline = startedAt + durationMs
const counts = new Map()
let completed = 0
let totalLatencyMs = 0
let maxLatencyMs = 0

function increment(key) {
  counts.set(key, (counts.get(key) || 0) + 1)
}

async function worker() {
  while (Date.now() < deadline) {
    const requestStartedAt = Date.now()
    try {
      const response = await fetch(target, {
        headers: { Accept: 'text/html, application/json' },
        signal: AbortSignal.timeout(requestTimeoutMs),
      })
      await response.arrayBuffer()
      increment(String(response.status))
    } catch (error) {
      increment(error?.name === 'TimeoutError' ? 'timeout' : 'error')
    } finally {
      const latency = Date.now() - requestStartedAt
      completed += 1
      totalLatencyMs += latency
      maxLatencyMs = Math.max(maxLatencyMs, latency)
    }
  }
}

console.log(
  JSON.stringify(
    {
      target: target.href,
      concurrency,
      durationMs,
      requestTimeoutMs,
      startedAt: new Date(startedAt).toISOString(),
    },
    null,
    2
  )
)

await Promise.all(Array.from({ length: concurrency }, () => worker()))

const elapsedMs = Date.now() - startedAt
console.log(
  JSON.stringify(
    {
      target: target.href,
      concurrency,
      elapsedMs,
      completed,
      requestsPerSecond: Number((completed / (elapsedMs / 1000)).toFixed(2)),
      averageLatencyMs: completed ? Number((totalLatencyMs / completed).toFixed(2)) : 0,
      maxLatencyMs,
      statuses: Object.fromEntries(counts),
    },
    null,
    2
  )
)
