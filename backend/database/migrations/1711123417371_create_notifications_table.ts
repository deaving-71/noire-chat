import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'notifications'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned().notNullable().index()
      table.foreign('user_id').references('users.id').onDelete('CASCADE')
      table.integer('friend_requests_count').unsigned().defaultTo(0)

      table.json('private_chats')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
