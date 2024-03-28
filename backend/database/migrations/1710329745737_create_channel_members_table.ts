import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_members'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.foreign('user_id').references('users.id')

      table.integer('channel_id').unsigned().notNullable()
      table.foreign('channel_id').references('channels.id')

      table.timestamp('last_seen_messages', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
