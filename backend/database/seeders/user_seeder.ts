import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Notification from '#models/notification'

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
    await Notification.createMany([
      {
        userId: 1,
        privateChats: [],
      },
      {
        userId: 2,
        privateChats: [],
      },
      {
        userId: 3,
        privateChats: [],
      },
    ])
  }
}
