import Submission from '#models/submission'

export interface ApiSubmission {
  id: string
  challengeId: string
  status: Submission['status']
  accepted: boolean | null
  results: Submission['results']
  consoleLogs: string[]
  client: Submission['client']
  clientVersion: string | null
  language: Submission['language']
  startedAt: string | null
  completedAt: string | null
  createdAt: string
}

export function serializeSubmission(submission: Submission): ApiSubmission {
  return {
    id: String(submission.id),
    challengeId: String(submission.exerciseId),
    status: submission.status,
    accepted: submission.accepted ?? null,
    results: submission.results || [],
    consoleLogs: submission.consoleLogs || [],
    client: submission.client,
    clientVersion: submission.clientVersion || null,
    language: submission.language,
    startedAt: submission.startedAt?.toISO() || null,
    completedAt: submission.completedAt?.toISO() || null,
    createdAt: submission.createdAt?.toISO() || new Date().toISOString(),
  }
}
