export interface ApiUser {
  id: string
  username: string
  email: string
  avatar: string | null
  role: 'user' | 'admin' | 'super_admin'
  status: 'active' | 'suspended'
  emailVerifiedAt: string | null
}

export interface Challenge {
  id: string
  slug: string
  number: number
  title: string
  description: string
  language: 'javascript'
  difficulty: number
  difficultyLabel: 'easy' | 'medium' | 'hard'
  category: string
  points: number
  status: 'published'
  starterCode: string | null
  hint: string | null
  prerequisiteId: string | null
  isUnlocked: boolean
  isCompleted: boolean
  progressStatus: 'locked' | 'available' | 'in_progress' | 'completed'
}

export interface ChallengeListResponse {
  data: Challenge[]
  meta: {
    total: number
    perPage: number
    currentPage: number
    lastPage: number
  }
}

export interface Submission {
  id: string
  challengeId: string
  status: 'queued' | 'running' | 'passed' | 'failed' | 'timeout' | 'error'
  accepted: boolean | null
  results: Array<{
    description: string
    passed: boolean
    error?: string
  }>
  consoleLogs: string[]
  errorMessage?: string | null
  client: 'web' | 'terminal'
  clientVersion: string | null
  language: 'javascript'
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export type User = ApiUser
