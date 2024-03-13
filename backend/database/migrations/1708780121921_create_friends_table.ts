import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'friends'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable().index()
      table.integer('friend_id').unsigned().notNullable().index()
      table.foreign('user_id').references('users.id')
      table.foreign('friend_id').references('users.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
