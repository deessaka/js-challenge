import type User from '#models/user'

export const PORTAL_INTENDED_KEY = 'portal.intended'

export function portalDestination(user: Pick<User, 'role'>) {
  return ['admin', 'super_admin'].includes(user.role) ? '/admin' : '/profile#api-token'
}

export function isSafePortalDestination(value: unknown, user: Pick<User, 'role'>) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//')) return false

  let url: URL
  try {
    url = new URL(value, 'http://codojo.local')
  } catch {
    return false
  }

  if (url.origin !== 'http://codojo.local' || url.username || url.password) return false
  if (url.pathname === '/profile' || url.pathname === '/password/edit') return true
  return (
    (user.role === 'admin' || user.role === 'super_admin') &&
    (url.pathname === '/admin' || url.pathname.startsWith('/admin/'))
  )
}

export function intendedPortalDestination(value: unknown, user: Pick<User, 'role'>) {
  return isSafePortalDestination(value, user) ? String(value) : portalDestination(user)
}
