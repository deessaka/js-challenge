import { test } from '@japa/runner'
import { shouldSeedTestUser } from '#database/seeders/user_seeder'

test.group('User seeder', () => {
  test('does not seed the test account in production', ({ assert }) => {
    assert.isFalse(shouldSeedTestUser('production'))
  })

  test('seeds the test account outside production', ({ assert }) => {
    assert.isTrue(shouldSeedTestUser('development'))
    assert.isTrue(shouldSeedTestUser('test'))
  })
})
