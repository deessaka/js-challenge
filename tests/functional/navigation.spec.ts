import { test } from '@japa/runner'

test.group('Web navigation routes', () => {
  const publicRoutes = [
    '/',
    '/about',
    '/auth/login',
    '/auth/register',
    '/password/request-reset',
  ]

  for (const path of publicRoutes) {
    test(`renders ${path}`, async ({ client }) => {
      const response = await client.get(path)

      response.assertStatus(200)
      response.assertHeader('content-type', 'text/html; charset=utf-8')
    })
  }

  const protectedRoutes = ['/home', '/profile', '/profile/api-tokens', '/password/edit', '/admin']

  for (const path of protectedRoutes) {
    test(`redirects guests from ${path} to login`, async ({ client }) => {
      const response = await client.get(path).redirects(0)

      response.assertStatus(302)
      response.assertHeader('location', '/auth/login')
    })
  }

  test('returns a real not-found response for an unknown internal URL', async ({ client }) => {
    const response = await client.get('/route-that-does-not-exist')

    response.assertStatus(404)
  })
})
