import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'membership'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('member_id').unsigned().notNullable()
      table.foreign('member_id').references('users.id')

      table.integer('channel_id').unsigned().notNullable()
      table.foreign('channel_id').references('channels.id')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
