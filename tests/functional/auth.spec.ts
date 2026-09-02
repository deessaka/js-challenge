import { randomUUID } from 'node:crypto'

import { DateTime } from 'luxon'
import testUtils from '@adonisjs/core/services/test_utils'
import { test } from '@japa/runner'
import type { AllyUserContract, GithubToken, SocialProviders } from '@adonisjs/ally/types'
import redis from '@adonisjs/redis/services/main'

import User from '#models/user'
import OAuthService from '#services/oauth_service'
import { clearPublishedExerciseCatalogCache } from '#services/user_progress'

async function clearRateLimit(path: string) {
  const keys = await redis.keys(`rate_limit:${path}:*`)
  if (keys.length) await redis.del(...keys)
}

function uniqueEmail(label: string): string {
  return `${label}-${randomUUID().slice(0, 8)}@example.com`
}

function githubSocialUser(overrides: Partial<AllyUserContract<GithubToken>> = {}) {
  return {
    id: randomUUID(),
    nickName: `octocat-${randomUUID().slice(0, 8)}`,
    name: 'Octocat',
    email: uniqueEmail('oauth'),
    emailVerificationState: 'verified',
    avatarUrl: 'https://example.com/avatar.png',
    token: { token: 'gh-token', type: 'bearer', scope: 'user:email' },
    original: {},
    ...overrides,
  } as AllyUserContract<GithubToken>
}

test.group('Auth registration and login', (group) => {
  let rollback: (() => Promise<void>) | undefined

  group.setup(async () => {
    rollback = await testUtils.db().migrate()
    // /auth/register and /auth/login are rate-limited per IP against the real
    // redis instance, so stale counters from earlier test runs must be cleared.
    await clearRateLimit('/auth/register')
    await clearRateLimit('/auth/login')
    // UserProgressService caches the published exercise catalog in-process for
    // 15s; a prior suite's exercises would otherwise leak in as stale ids here.
    clearPublishedExerciseCatalogCache()
  })

  group.teardown(async () => {
    await rollback?.()
  })

  // Skipped while /auth/register is disabled — see start/routes.ts. Re-enable
  // alongside the route.
  test('offers to resend the verification email when registering with an existing unverified email', async ({
    client,
    assert,
  }) => {
    const email = uniqueEmail('case-email')
    await User.create({
      username: `existing-${randomUUID().slice(0, 8)}`,
      email,
      password: 'Password123!',
    })

    const response = await client
      .post('/auth/register')
      .withCsrfToken()
      .redirects(0)
      .form({
        username: `newuser-${randomUUID().slice(0, 8)}`,
        email: email.toUpperCase(),
        password: 'Password123!',
        password_confirmation: 'Password123!',
      })

    response.assertStatus(200)
    response.assertTextIncludes('n’est pas encore vérifié')
    response.assertTextIncludes('Recevoir le lien de vérification')

    const total = await User.query().whereILike('email', email).count('* as total')
    assert.equal(Number(total[0].$extras.total), 1)
  }).skip(true, 'Registration is disabled — see start/routes.ts. Re-enable alongside the route.')

  // Skipped while /auth/register is disabled — see start/routes.ts. Re-enable
  // alongside the route.
  test('rejects registration when the email already exists and is verified', async ({
    client,
    assert,
  }) => {
    const email = uniqueEmail('verified-email')
    await User.create({
      username: `existing-${randomUUID().slice(0, 8)}`,
      email,
      password: 'Password123!',
      emailVerifiedAt: DateTime.now(),
    })

    const response = await client
      .post('/auth/register')
      .withCsrfToken()
      .redirects(0)
      .form({
        username: `newuser-${randomUUID().slice(0, 8)}`,
        email: email.toUpperCase(),
        password: 'Password123!',
        password_confirmation: 'Password123!',
      })

    response.assertStatus(302)
    response.assertFlashMessage('error', 'Un compte existe déjà avec cette adresse e-mail.')

    const total = await User.query().whereILike('email', email).count('* as total')
    assert.equal(Number(total[0].$extras.total), 1)
  }).skip(true, 'Registration is disabled — see start/routes.ts. Re-enable alongside the route.')

  test('renders a resend-verification form when no email is known yet', async ({ client }) => {
    const response = await client.get('/auth/resend-verification')

    response.assertStatus(200)
    response.assertTextIncludes('Renvoyer l’email de vérification')
    response.assertTextIncludes('Indiquez votre adresse email')
  })

  // Skipped while /auth/register is disabled — see start/routes.ts. Re-enable
  // alongside the route.
  test('rejects registration when the username already exists under different casing', async ({
    client,
    assert,
  }) => {
    const username = `dupuser-${randomUUID().slice(0, 8)}`
    await User.create({
      username,
      email: uniqueEmail('base-user'),
      password: 'Password123!',
    })

    const response = await client
      .post('/auth/register')
      .withCsrfToken()
      .redirects(0)
      .form({
        username: username.toUpperCase(),
        email: uniqueEmail('new-user'),
        password: 'Password123!',
        password_confirmation: 'Password123!',
      })

    response.assertStatus(302)
    response.assertFlashMessage('error', 'Ce nom d’utilisateur est déjà pris.')

    const total = await User.query().whereILike('username', username).count('* as total')
    assert.equal(Number(total[0].$extras.total), 1)
  }).skip(true, 'Registration is disabled — see start/routes.ts. Re-enable alongside the route.')

  test('logs in with an email in different casing than it was registered with', async ({
    client,
  }) => {
    const email = uniqueEmail('login-case')
    await User.create({
      username: `login-${randomUUID().slice(0, 8)}`,
      email,
      password: 'Password123!',
      emailVerifiedAt: DateTime.now(),
      role: 'admin',
    })

    const response = await client
      .post('/auth/login')
      .withCsrfToken()
      .redirects(0)
      .form({
        email: email.toUpperCase(),
        password: 'Password123!',
      })

    response.assertStatus(302)
    response.assertFlashMissing('error')
  })

  test('redirects to the resend-verification page when logging in with an unverified email', async ({
    client,
  }) => {
    const email = uniqueEmail('unverified-login')
    await User.create({
      username: `login-${randomUUID().slice(0, 8)}`,
      email,
      password: 'Password123!',
      role: 'admin',
    })

    const response = await client
      .post('/auth/login')
      .withCsrfToken()
      .redirects(0)
      .form({ email, password: 'Password123!' })

    response.assertStatus(200)
    response.assertTextIncludes('n’est pas encore vérifié')
    response.assertTextIncludes('Recevoir le lien de vérification')
  })

  test('blocks password login for a non-admin account, even with correct credentials', async ({
    client,
  }) => {
    const email = uniqueEmail('non-admin-login')
    await User.create({
      username: `login-${randomUUID().slice(0, 8)}`,
      email,
      password: 'Password123!',
      emailVerifiedAt: DateTime.now(),
      role: 'user',
    })

    const response = await client
      .post('/auth/login')
      .withCsrfToken()
      .redirects(0)
      .form({ email, password: 'Password123!' })

    response.assertStatus(302)
    response.assertFlashMessage(
      'error',
      'Ce compte doit se connecter via GitHub. Utilisez le bouton « Continuer avec GitHub » ci-dessus avec la même adresse email.'
    )

    const meResponse = await client.get('/profile').redirects(0)
    meResponse.assertStatus(302)
    meResponse.assertHeader('location', '/auth/login')
  })

  test('registration routes are disabled', async ({ client }) => {
    const getResponse = await client.get('/auth/register')
    getResponse.assertStatus(404)

    const postResponse = await client
      .post('/auth/register')
      .withCsrfToken()
      .redirects(0)
      .form({
        username: `newuser-${randomUUID().slice(0, 8)}`,
        email: uniqueEmail('disabled-register'),
        password: 'Password123!',
        password_confirmation: 'Password123!',
      })
    postResponse.assertStatus(404)
  })
})

test.group('OAuthService username collisions', (group) => {
  let rollback: (() => Promise<void>) | undefined

  group.setup(async () => {
    rollback = await testUtils.db().migrate()
  })

  group.teardown(async () => {
    await rollback?.()
  })

  test('creates a second account with a suffixed username when the GitHub nickname collides', async ({
    assert,
  }) => {
    const nickName = `octocat-${randomUUID().slice(0, 8)}`
    await User.create({
      username: nickName,
      email: uniqueEmail('existing-oauth'),
      password: 'Password123!',
    })

    const socialUser = githubSocialUser({ nickName })

    let createdUser: User | undefined
    const provider = 'github' as unknown as SocialProviders

    await new OAuthService(socialUser, provider).onFindOrCreate(async (user) => {
      createdUser = user
    }).exec()

    assert.exists(createdUser)
    assert.notEqual(createdUser!.username, nickName)
    assert.isTrue(createdUser!.username.startsWith(`${nickName}-`))
    assert.equal(createdUser!.email, socialUser.email)
  })
})
