import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'private_chats'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('sender_id').unsigned().notNullable()
      table.integer('receiver_id').unsigned().notNullable()
      table.foreign('sender_id').references('users.id').onDelete('CASCADE')
      table.foreign('receiver_id').references('users.id').onDelete('CASCADE')

      table.timestamp('created_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
