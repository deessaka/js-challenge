import type { ApiUser, Challenge, ChallengeListResponse, Submission } from './types.js'
import { VERSION } from './version.js'

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly payload?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

interface ApiEnvelope<T> {
  data: T
}

export class ApiClient {
  constructor(
    private readonly baseUrl: string,
    private readonly getToken: () => string | undefined | Promise<string | undefined>
  ) {}

  async getMe(): Promise<ApiUser> {
    return this.request<ApiEnvelope<ApiUser>>('/api/v1/me').then((response) => response.data)
  }

  async listChallenges(page = 1, perPage = 200): Promise<ChallengeListResponse> {
    return this.request<ChallengeListResponse>(`/api/v1/challenges?page=${page}&perPage=${perPage}`)
  }

  async listAllChallenges(): Promise<ChallengeListResponse> {
    const first = await this.listChallenges(1, 50)
    const data = [...first.data]
    for (let page = 2; page <= first.meta.lastPage; page += 1) {
      const next = await this.listChallenges(page, 50)
      data.push(...next.data)
    }
    return { data, meta: { ...first.meta, perPage: data.length, currentPage: 1, lastPage: 1 } }
  }

  async getChallenge(slug: string): Promise<Challenge> {
    return this.request<ApiEnvelope<Challenge>>(
      `/api/v1/challenges/${encodeURIComponent(slug)}`
    ).then((response) => response.data)
  }

  async getNextChallenge(): Promise<Challenge | null> {
    return this.request<ApiEnvelope<Challenge | null>>('/api/v1/recommendations/next').then(
      (response) => response.data
    )
  }

  async createSubmission(input: {
    challengeId: string
    code: string
    idempotencyKey?: string
    dryRun?: boolean
  }): Promise<Submission> {
    return this.request<ApiEnvelope<Submission>>('/api/v1/submissions', {
      method: 'POST',
      body: JSON.stringify({
        ...input,
        language: 'javascript',
        client: 'terminal',
        clientVersion: VERSION,
      }),
    }).then((response) => response.data)
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const headers = new Headers(init.headers)
    headers.set('Accept', 'application/json')
    if (init.body) headers.set('Content-Type', 'application/json')

    const token = await this.getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let response: Response
    try {
      response = await fetch(`${this.baseUrl.replace(/\/$/, '')}${path}`, { ...init, headers })
    } catch (error) {
      throw new ApiError(
        'Impossible de joindre Codojo. Vérifiez l’URL de l’API et votre connexion.',
        0,
        error
      )
    }

    const text = await response.text()
    let payload: unknown = null
    if (text) {
      try {
        payload = JSON.parse(text)
      } catch {
        payload = text
      }
    }

    if (!response.ok) {
      const message =
        typeof payload === 'object' && payload !== null && 'error' in payload
          ? String((payload as { error: unknown }).error)
          : `La requête API a échoué (${response.status}).`
      throw new ApiError(message, response.status, payload)
    }

    return payload as T
  }
}
