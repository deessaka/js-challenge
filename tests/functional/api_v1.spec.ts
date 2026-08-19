import { randomUUID } from 'node:crypto'

import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'

import Exercise from '#models/exercise'
import User from '#models/user'
import UserProgress from '#models/user_progress'
import Submission from '#models/submission'

interface AuthenticatedUser {
  user: User
  token: string
}

async function createAuthenticatedUser(label: string): Promise<AuthenticatedUser> {
  const user = await User.create({
    username: `api-${label}-${randomUUID().slice(0, 8)}`,
    email: `api-${label}-${randomUUID().slice(0, 8)}@example.com`,
    password: 'Password123!',
    role: 'user',
    status: 'active',
    emailVerifiedAt: DateTime.now(),
  })
  const accessToken = await User.accessTokens.create(user, ['*'], {
    name: `functional-${label}`,
  })

  return {
    user,
    token: accessToken.value!.release(),
  }
}

async function createPublishedExercise(number = 1): Promise<Exercise> {
  return Exercise.create({
    title: `API challenge ${number}`,
    number,
    description: 'Challenge fonctionnel pour l’API v1.',
    difficulty: 8,
    slug: `api-challenge-${number}-${randomUUID().slice(0, 8)}`,
    category: 'JavaScript',
    points: 10,
    status: 'published',
    starterCode: 'function number(busStops) { return 0 }',
    hint: 'Additionner les montées et soustraire les descentes.',
  })
}

test.group('API v1 authenticated endpoints', (group) => {
  let rollback: (() => Promise<void>) | undefined
  let primary: AuthenticatedUser
  let secondary: AuthenticatedUser
  let exercise: Exercise

  group.setup(async () => {
    rollback = await testUtils.db().migrate()
    primary = await createAuthenticatedUser('primary')
    secondary = await createAuthenticatedUser('secondary')
    exercise = await createPublishedExercise()

    await UserProgress.create({
      userId: primary.user.id,
      exerciseId: Number(exercise.id),
      isUnlocked: true,
      completed: false,
      unlockedAt: DateTime.now(),
    })
  })

  group.teardown(async () => {
    await rollback?.()
  })

  test('rejects unauthenticated API requests', async ({ client }) => {
    const response = await client.get('/api/v1/me')
    response.assertStatus(401)
  })

  test('returns the authenticated user without sensitive fields', async ({ client }) => {
    const response = await client
      .get('/api/v1/me')
      .header('Authorization', `Bearer ${primary.token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: primary.user.id,
        username: primary.user.username,
        email: primary.user.email,
        role: 'user',
        status: 'active',
      },
    })
    response.assertBodyNotContains({ password: 'Password123!' })
  })

  test('lists published challenges with the current user progress', async ({ client }) => {
    const response = await client
      .get('/api/v1/challenges')
      .header('Authorization', `Bearer ${primary.token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [
        {
          id: String(exercise.id),
          slug: exercise.slug,
          isUnlocked: true,
          isCompleted: false,
          difficulty: 8,
          difficultyLabel: 'easy',
        },
      ],
    })
  })

  test('does not leak another user progress state', async ({ client }) => {
    const response = await client
      .get('/api/v1/challenges')
      .header('Authorization', `Bearer ${secondary.token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [
        {
          id: String(exercise.id),
          isUnlocked: true,
          isCompleted: false,
        },
      ],
    })
  })

  test('returns challenge detail with starter code for an authenticated user', async ({
    client,
  }) => {
    const response = await client
      .get(`/api/v1/challenges/${exercise.slug}`)
      .header('Authorization', `Bearer ${primary.token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: String(exercise.id),
        slug: exercise.slug,
        starterCode: exercise.starterCode,
        hint: exercise.hint,
      },
    })
  })

  test('returns summary and challenge-level progress', async ({ client }) => {
    const summaryResponse = await client
      .get('/api/v1/progress')
      .header('Authorization', `Bearer ${primary.token}`)
    summaryResponse.assertStatus(200)
    summaryResponse.assertBodyContains({
      data: {
        completed: 0,
        unlocked: 1,
        inProgress: 1,
      },
    })

    const challengeResponse = await client
      .get(`/api/v1/progress/${exercise.id}`)
      .header('Authorization', `Bearer ${primary.token}`)
    challengeResponse.assertStatus(200)
    challengeResponse.assertBodyContains({
      data: {
        challengeId: String(exercise.id),
        status: 'available',
        attempts: 0,
        successfulAttempts: 0,
      },
    })
  })

  test('returns the next unlocked challenge', async ({ client }) => {
    const response = await client
      .get('/api/v1/recommendations/next')
      .header('Authorization', `Bearer ${primary.token}`)

    response.assertStatus(200)
    response.assertBodyContains({
      data: {
        id: String(exercise.id),
        isUnlocked: true,
        isCompleted: false,
      },
    })
  })

  test('rejects invalid submission payloads', async ({ client }) => {
    const response = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${primary.token}`)
      .header('Accept', 'application/json')
      .json({
        challengeId: String(exercise.id),
        code: '',
        language: 'python',
        client: 'terminal',
      })

    response.assertStatus(422)
  })

  test('rejects dry-runs and submissions for a locked challenge', async ({ client }) => {
    const lockedExercise = await createPublishedExercise(3)
    lockedExercise.prerequisiteId = Number(exercise.id)
    await lockedExercise.save()
    for (const dryRun of [true, false]) {
      const response = await client
        .post('/api/v1/submissions')
        .header('Authorization', `Bearer ${secondary.token}`)
        .header('Accept', 'application/json')
        .json({
          challengeId: String(lockedExercise.id),
          code: 'function number() { return 0 }',
          language: 'javascript',
          client: 'terminal',
          dryRun,
        })

      response.assertStatus(403)
      response.assertBodyContains({ code: 'CHALLENGE_LOCKED' })
    }
  })

  test('creates and returns a passed submission', async ({ client, assert }) => {
    const nextExercise = await createPublishedExercise(2)
    nextExercise.prerequisiteId = Number(exercise.id)
    nextExercise.points = 20
    await nextExercise.save()
    const code = `function number(busStops) {
      const result = busStops.reduce((total, [on, off]) => total + on - off, 0)
      console.log('sortie terminal', result)
      return result
    }`

    const beforeDryRun = await Submission.query().where('user_id', primary.user.id).count('* as total')
    const dryRunResponse = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${primary.token}`)
      .json({
        challengeId: String(exercise.id),
        code,
        language: 'javascript',
        client: 'terminal',
        dryRun: true,
      })
    dryRunResponse.assertStatus(201)
    const afterDryRun = await Submission.query().where('user_id', primary.user.id).count('* as total')
    assert.equal(afterDryRun[0].$extras.total, beforeDryRun[0].$extras.total)

    const idempotencyKey = `submission-${randomUUID()}`
    const response = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${primary.token}`)
      .json({
        challengeId: String(exercise.id),
        code,
        language: 'javascript',
        client: 'terminal',
        clientVersion: '0.1.0',
        idempotencyKey,
      })

    response.assertStatus(201)
    response.assertBodyContains({
      data: {
        challengeId: String(exercise.id),
        status: 'passed',
        accepted: true,
        client: 'terminal',
        clientVersion: '0.1.0',
        consoleLogs: ['sortie terminal 5', 'sortie terminal 17', 'sortie terminal 21'],
      },
    })

    const retry = await client
      .post('/api/v1/submissions')
      .header('Authorization', `Bearer ${primary.token}`)
      .json({
        challengeId: String(exercise.id),
        code,
        language: 'javascript',
        client: 'terminal',
        idempotencyKey,
      })
    retry.assertStatus(201)
    assert.equal(retry.body().data.id, response.body().data.id)

    const progress = await client
      .get(`/api/v1/progress/${exercise.id}`)
      .header('Authorization', `Bearer ${primary.token}`)
    progress.assertBodyContains({
      data: { status: 'completed', attempts: 1, successfulAttempts: 1 },
    })

    const summary = await client
      .get('/api/v1/progress')
      .header('Authorization', `Bearer ${primary.token}`)
    summary.assertBodyContains({ data: { completed: 1, points: 10, currentStreak: 1 } })

    const next = await client
      .get(`/api/v1/challenges/${nextExercise.slug}`)
      .header('Authorization', `Bearer ${primary.token}`)
    next.assertBodyContains({ data: { isUnlocked: true, isCompleted: false } })
  })
})
