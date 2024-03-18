import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'

export default class UserSeeder extends BaseSeeder {
  async run() {
    await User.createMany([
      {
        email: 'admin@admin.com',
        username: 'admin',
        password: 'admin',
      },
      {
        email: 'admin2@admin.com',
        username: 'admin2',
        password: 'admin2',
      },
      {
        email: 'deaving@gmail.com',
        username: 'deaving',
        password: '12345678',
      },
    ])
  }
}
