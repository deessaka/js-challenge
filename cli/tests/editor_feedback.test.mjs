import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LatestDryRun,
  createEditorFeedbackState,
  editorFeedbackLines,
  reduceEditorFeedback,
} from '../dist/ui/editor_feedback.js'

const passingSubmission = {
  status: 'passed',
  accepted: true,
  results: [
    { description: 'returns one', passed: true },
    { description: 'returns two', passed: true },
  ],
  consoleLogs: ['first log', 'second log'],
}

test('the compact debug feedback exposes status, duration, logs and first error', () => {
  let state = createEditorFeedbackState()
  state = reduceEditorFeedback(state, { type: 'dry-run-started' })
  state = reduceEditorFeedback(state, {
    type: 'dry-run-succeeded',
    submission: {
      ...passingSubmission,
      status: 'failed',
      accepted: false,
      results: [
        { description: 'works', passed: true },
        {
          description: 'returns the expected value',
          passed: false,
          error: 'Expected 2, received 1',
        },
      ],
    },
    durationMs: 42,
  })

  assert.deepEqual(editorFeedbackLines(state), [
    "✗ Erreur d'exécution │ Durée : 42 ms",
    'Logs : 2 │ first log',
    'Erreur : Expected 2, received 1',
  ])
})

test('changing the buffer makes the latest result visibly obsolete', () => {
  let state = reduceEditorFeedback(createEditorFeedbackState(), {
    type: 'dry-run-succeeded',
    submission: passingSubmission,
    durationMs: 12,
  })

  state = reduceEditorFeedback(state, { type: 'buffer-changed' })

  assert.equal(state.isStale, true)
  assert.match(editorFeedbackLines(state)[0], /obsolète.*Ctrl\+T/)
})

test('only the latest dry-run can produce an outcome', async () => {
  const pending = []
  let time = 100
  const dryRuns = new LatestDryRun(() => time)
  const execute = () =>
    new Promise((resolve) => {
      pending.push(resolve)
    })

  const first = dryRuns.run(execute)
  time = 120
  const second = dryRuns.run(execute)
  time = 150
  pending[1](passingSubmission)
  assert.deepEqual(await second, { submission: passingSubmission, durationMs: 30 })

  time = 180
  pending[0]({ ...passingSubmission, consoleLogs: ['obsolete'] })
  assert.equal(await first, null)
})

test('a buffer change invalidates an in-flight dry-run', async () => {
  let resolveRequest
  const dryRuns = new LatestDryRun(() => 0)
  const request = dryRuns.run(
    () =>
      new Promise((resolve) => {
        resolveRequest = resolve
      })
  )

  dryRuns.invalidate()
  resolveRequest(passingSubmission)

  assert.equal(await request, null)
})
