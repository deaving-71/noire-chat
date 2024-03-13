import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'channel_messages'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('channel_id').unsigned().notNullable()
      table.integer('sender_id').unsigned().notNullable()
      table.text('content', 'longtext').notNullable()

      table.foreign('channel_id').references('channels.id').onDelete('CASCADE')
      table.foreign('sender_id').references('users.id').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
