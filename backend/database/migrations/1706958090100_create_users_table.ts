import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('username').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('avatar').defaultTo('default_avatar.jpg') //TODO: <<< migrate
      table.string('password').notNullable()
      table.boolean('is_online').defaultTo(false)
      table.boolean('status').defaultTo(true)

      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}
