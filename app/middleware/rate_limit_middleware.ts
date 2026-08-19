import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import redis from '@adonisjs/redis/services/main'

/**
 * Rate limit middleware to prevent brute force attacks
 * Uses Redis to track request counts per IP address
 */
export default class RateLimitMiddleware {
  /**
   * Handle the request and apply rate limiting
   *
   * @param ctx - HTTP context
   * @param next - Next function
   * @param options - Rate limit configuration
   * @param options.maxAttempts - Maximum number of attempts allowed (default: 5)
   * @param options.decayMinutes - Time window in minutes (default: 15)
   */
  async handle(
    ctx: HttpContext,
    next: NextFn,
    options: {
      maxAttempts?: number
      decayMinutes?: number
    } = {}
  ) {
    const { maxAttempts = 5, decayMinutes = 15 } = options
    const { request, response } = ctx

    // Get client IP address
    const identity = ctx.auth.user?.id || request.ip()
    const key = `rate_limit:${request.url()}:${identity}`

    // Get current attempt count
    const attempts = await redis.get(key)
    const currentAttempts = attempts ? parseInt(attempts) : 0

    // Check if rate limit exceeded
    if (currentAttempts >= maxAttempts) {
      const ttl = await redis.ttl(key)
      const retryAfter = ttl > 0 ? Math.ceil(ttl / 60) : decayMinutes

      return response
        .status(429)
        .header('Retry-After', String(retryAfter * 60))
        .send({
          message: `Too many attempts. Please try again in ${retryAfter} minute${retryAfter > 1 ? 's' : ''}.`,
          retryAfter: retryAfter * 60,
        })
    }

    // Increment attempt count
    const newAttempts = currentAttempts + 1
    const ttlSeconds = decayMinutes * 60

    if (currentAttempts === 0) {
      // First attempt - set with expiry
      await redis.set(key, String(newAttempts), 'EX', ttlSeconds)
    } else {
      // Increment existing counter
      await redis.incr(key)
    }

    // Add rate limit headers
    response.header('X-RateLimit-Limit', String(maxAttempts))
    response.header('X-RateLimit-Remaining', String(Math.max(0, maxAttempts - newAttempts)))

    await next()
  }
}
