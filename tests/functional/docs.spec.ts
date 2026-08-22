import { test } from '@japa/runner'

const renderedDocumentationPaths = ['/docs', '/docs/index', '/docs/getting-started']

test.group('Integrated documentation', () => {
  for (const path of renderedDocumentationPaths) {
    test(`renders ${path} without an injected script`, async ({ assert, client }) => {
      const response = await client.get(path)

      response.assertStatus(200)
      response.assertHeader('content-type', 'text/html; charset=utf-8')
      assert.notInclude(response.text(), '<script>alert(1)</script>')
    })
  }

  test('returns a not-found response for an unknown documentation slug', async ({ client }) => {
    const response = await client.get('/docs/slug-inexistant')

    response.assertStatus(404)
  })

  test('rejects an encoded path traversal attempt', async ({ client }) => {
    const response = await client.get('/docs/%2e%2e%2fetc%2fpasswd')

    response.assertStatus(404)
  })

  test('rejects a slug containing executable markup', async ({ client }) => {
    const response = await client.get('/docs/%3Cscript%3Ealert(1)%3C%2Fscript%3E')

    response.assertStatus(404)
  })
})
