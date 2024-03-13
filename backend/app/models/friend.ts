import { BaseModel, column } from '@adonisjs/lucid/orm'

export default class Friend extends BaseModel {
  @column()
  declare userId: number

  @column()
  declare friendId: number

  static async areFriends({ receiverId, senderId }: { senderId: number; receiverId: number }) {
    const areFriends = await Friend.query().where('userId', senderId).where('friendId', receiverId)
    return areFriends.length === 1
  }
}
