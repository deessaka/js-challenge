import * as vscode from 'vscode'

import type { ApiUser, Challenge, ChallengeListResponse, Submission } from './types'

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
    private readonly secrets: vscode.SecretStorage,
    private readonly config: vscode.WorkspaceConfiguration
  ) {}

  async getMe(): Promise<ApiUser> {
    return this.request<ApiEnvelope<ApiUser>>('/api/v1/me').then((response) => response.data)
  }

  async listChallenges(): Promise<ChallengeListResponse> {
    return this.request<ChallengeListResponse>('/api/v1/challenges')
  }

  async getChallenge(slug: string): Promise<Challenge> {
    return this.request<ApiEnvelope<Challenge>>(`/api/v1/challenges/${encodeURIComponent(slug)}`).then(
      (response) => response.data
    )
  }

  async getNextChallenge(): Promise<Challenge | null> {
    return this.request<ApiEnvelope<Challenge | null>>('/api/v1/recommendations/next').then(
      (response) => response.data
    )
  }

  async createSubmission(input: {
    challengeId: string
    code: string
    idempotencyKey: string
  }): Promise<Submission> {
    return this.request<ApiEnvelope<Submission>>('/api/v1/submissions', {
      method: 'POST',
      body: JSON.stringify({
        ...input,
        language: 'javascript',
        client: 'vscode',
        clientVersion: '0.1.0',
      }),
    }).then((response) => response.data)
  }

  async loginWithToken(token: string): Promise<ApiUser> {
    await this.secrets.store('jsChallenge.apiToken', token)
    try {
      return await this.getMe()
    } catch (error) {
      await this.logout()
      throw error
    }
  }

  async logout(): Promise<void> {
    await this.secrets.delete('jsChallenge.apiToken')
  }

  async isAuthenticated(): Promise<boolean> {
    return Boolean(await this.secrets.get('jsChallenge.apiToken'))
  }

  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const baseUrl = this.config.get<string>('apiBaseUrl', 'http://localhost:3333').replace(/\/$/, '')
    const token = await this.secrets.get('jsChallenge.apiToken')
    const headers = new Headers(init.headers)
    headers.set('Accept', 'application/json')
    if (init.body) headers.set('Content-Type', 'application/json')
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let response: Response
    try {
      response = await fetch(`${baseUrl}${path}`, { ...init, headers })
    } catch (error) {
      throw new ApiError(
        'Impossible de joindre JS Challenge. Vérifiez l’URL de l’API et votre connexion.',
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
