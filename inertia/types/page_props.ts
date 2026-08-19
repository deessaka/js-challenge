export type SessionUser = {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended'
  unlockedExercises?: number
  totalPoints?: number
}

export type SharedPageProps = {
  appName: string
  user: SessionUser | null
  flash?: {
    success?: string
    error?: string
    warning?: string
    info?: string
    apiToken?: string
  }
}
