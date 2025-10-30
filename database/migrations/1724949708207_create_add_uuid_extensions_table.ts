import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'add_uuid_extensions'

  async up() {
    this.defer(async () => {
      await this.db.rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"').exec()
    })
  }

  async down() {
    this.defer(async () => {
      await this.db.rawQuery('DROP EXTENSION IF EXISTS "uuid-ossp"').exec()
    })
  }
}