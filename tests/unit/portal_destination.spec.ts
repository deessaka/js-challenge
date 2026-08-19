import { test } from '@japa/runner'

import {
  intendedPortalDestination,
  isSafePortalDestination,
  portalDestination,
} from '#services/portal_destination_service'

const user = { role: 'user' as const }
const admin = { role: 'admin' as const }

test.group('Portal destinations', () => {
  test('routes each role directly to its portal', ({ assert }) => {
    assert.equal(portalDestination(user), '/profile#api-token')
    assert.equal(portalDestination(admin), '/admin')
  })

  test('restores only allow-listed internal GET destinations', ({ assert }) => {
    assert.isTrue(isSafePortalDestination('/profile?tab=security', user))
    assert.isTrue(isSafePortalDestination('/password/edit', user))
    assert.isTrue(isSafePortalDestination('/admin/users?page=2', admin))
    assert.isFalse(isSafePortalDestination('/admin/users', user))
    assert.isFalse(isSafePortalDestination('//evil.example/profile', admin))
    assert.isFalse(isSafePortalDestination('https://evil.example/profile', admin))
    assert.isFalse(isSafePortalDestination('/api/v1/me', admin))
    assert.isFalse(isSafePortalDestination('/auth/logout', admin))
  })

  test('falls back according to role when an intended URL is unsafe', ({ assert }) => {
    assert.equal(intendedPortalDestination('/admin/users', user), '/profile#api-token')
    assert.equal(intendedPortalDestination('https://evil.example', admin), '/admin')
  })
})
