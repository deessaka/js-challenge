import mail from '@adonisjs/mail/services/main'
import logger from '@adonisjs/core/services/logger'
import env from '#start/env'

interface MailOptions {
  from?: string
  to: string
  subject: string
  template: string
  data: any
}

export default class MailService {
  async send(options: MailOptions): Promise<any> {
    try {
      logger.info(`Attempting to send email to ${options.to} with subject: ${options.subject}`)

      const result = await mail.send((msg) => {
        msg.to(options.to)
        msg.subject(options.subject)
        msg.htmlView(options.template, options.data)
      })

      logger.info(`Email sent successfully to ${options.to}`)
      if (env.get('MAIL_DRIVER') === 'json') {
        logger.info(`[dev mail] not actually sent — data: ${JSON.stringify(options.data)}`)
      }
      return result
    } catch (error) {
      logger.error(`Failed to send email to ${options.to}: ${error.message}`, {
        error,
        options,
      })
      throw error
    }
  }
}
