import User from '#models/user'

export interface ApiUser {
  id: string
  username: string
  email: string
  avatar: string | null
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended'
  emailVerifiedAt: string | null
}

export function serializeApiUser(user: User): ApiUser {
  return {
    id: String(user.id),
    username: user.username,
    email: user.email,
    avatar: user.avatar || null,
    role: user.role,
    status: user.status,
    emailVerifiedAt: user.emailVerifiedAt?.toISO() || null,
  }
}
