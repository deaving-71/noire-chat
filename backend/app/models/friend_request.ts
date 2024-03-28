import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class FriendRequest extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare senderId: number

  @column()
  declare receiverId: number

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiverId' })
  declare receiver: BelongsTo<typeof User>

  static async getUserFriendRequests(userId: number) {
    const friendRequestsSent = await this.query().where({ senderId: userId }).preload('receiver')

    const friendRequestsReceived = await this.query()
      .where({ receiverId: userId })
      .preload('sender')

    return { incoming: friendRequestsReceived, outgoing: friendRequestsSent }
  }

  static async get({ senderId, receiverId }: { senderId: number; receiverId: number }) {
    const friendRequest = await this.query()
      .where({ senderId: senderId, receiverId: receiverId })
      .first()

    return friendRequest
  }

  static async delete({ userOneId, userTwoId }: { userOneId: number; userTwoId: number }) {
    const request = await this.query()
      .where({ senderId: userOneId, receiverId: userTwoId })
      .orWhere({ senderId: userTwoId, receiverId: userOneId })
      .first()

    await request?.delete()

    return request
  }
}
