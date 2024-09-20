import mail from '@adonisjs/mail/services/main'
interface MailOptions {
  from?: string
  to: string
  subject: string
  template: string
  data: any
}

export default class MailService {
  async send(options: MailOptions): Promise<any> {
    return await mail.send((msg) => {
      msg.to(options.to)
      msg.subject(options.subject)
      msg.htmlView(options.template, options.data)
    })
  }
}
