import assert from 'node:assert/strict'
import test from 'node:test'

import { ApiClient, ApiError } from '../dist/api_client.js'

test('listAllChallenges follows every API page', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => {
    globalThis.fetch = originalFetch
  })
  const requestedPages = []
  globalThis.fetch = async (url) => {
    const page = Number(new URL(url).searchParams.get('page'))
    requestedPages.push(page)
    return new Response(
      JSON.stringify({
        data: [{ id: String(page), number: page }],
        meta: { total: 3, perPage: 1, currentPage: page, lastPage: 3 },
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const client = new ApiClient('https://example.test', () => 'token')
  const result = await client.listAllChallenges()

  assert.deepEqual(requestedPages, [1, 2, 3])
  assert.deepEqual(
    result.data.map((challenge) => challenge.id),
    ['1', '2', '3']
  )
})

test('API errors preserve stable server messages', async (context) => {
  const originalFetch = globalThis.fetch
  context.after(() => {
    globalThis.fetch = originalFetch
  })
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ code: 'CHALLENGE_LOCKED', error: 'Ce challenge est encore verrouillé.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )

  const client = new ApiClient('https://example.test', () => 'token')
  await assert.rejects(
    () => client.createSubmission({ challengeId: '2', code: 'return 2' }),
    (error) =>
      error instanceof ApiError &&
      error.status === 403 &&
      error.message === 'Ce challenge est encore verrouillé.'
  )
})
