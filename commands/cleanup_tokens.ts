import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import TokenService from '#services/token_service'

export default class CleanupTokens extends BaseCommand {
  static commandName = 'cleanup:tokens'
  static description = 'Cleanup expired authentication tokens from the database'

  static options: CommandOptions = {}

  async run() {
    this.logger.info('Starting token cleanup...')

    try {
      const tokenService = new TokenService()
      await tokenService.cleanupExpiredTokens()
      this.logger.success('Expired tokens cleaned up successfully')
    } catch (error) {
      this.logger.error('Failed to cleanup tokens')
      this.logger.error(error.message)
      this.exitCode = 1
    }
  }
}