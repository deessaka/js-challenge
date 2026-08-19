import env from '#start/env'
import { defineConfig, transports } from '@adonisjs/mail'

const mailConfig = defineConfig({
  default: (env.get('MAIL_DRIVER') || 'smtp') as 'smtp' | 'resend',

  /**
   * A static address for the "from" property. It will be
   * used unless an explicit from address is set on the
   * Email
   */
  from: {
    address: env.get('MAIL_FROM_ADDRESS') || 'onboarding@resend.dev',
    name: env.get('MAIL_FROM_NAME') || 'Codojo',
  },

  /**
   * A static address for the "reply-to" property. It will be
   * used unless an explicit replyTo address is set on the
   * Email
   */
  replyTo: {
    address: env.get('MAIL_REPLY_TO') || env.get('MAIL_FROM_ADDRESS') || 'onboarding@resend.dev',
    name: env.get('MAIL_FROM_NAME') || 'Codojo',
  },

  /**
   * The mailers object can be used to configure multiple mailers
   * each using a different transport or same transport with different
   * options.
   */
  mailers: {
    smtp: transports.smtp({
      host: env.get('SMTP_HOST') || 'localhost',
      port: env.get('SMTP_PORT') || 587,
      /**
       * Uncomment the auth block if your SMTP
       * server needs authentication
       */
      auth: {
        type: 'login',
        user: env.get('SMTP_USERNAME') || '',
        pass: env.get('SMTP_PASSWORD') || '',
      },
    }),

    resend: transports.resend({
      key: env.get('RESEND_API_KEY') || '',
      baseUrl: 'https://api.resend.com',
    }),
  },
})

export default mailConfig

declare module '@adonisjs/mail/types' {
  export interface MailersList extends InferMailers<typeof mailConfig> {}
}
