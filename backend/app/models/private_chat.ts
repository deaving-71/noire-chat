import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import PrivateChatMessage from '#models/private_chat_message'

export default class PrivateChat extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare senderId: number

  @column()
  declare receiverId: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => User, { foreignKey: 'receiverId' })
  declare receiver: BelongsTo<typeof User>

  @hasMany(() => PrivateChatMessage)
  declare messages: HasMany<typeof PrivateChatMessage>

  static async getChat({ senderId, receiverId }: { senderId: number; receiverId: number }) {
    const chat = await this.query()
      .where({ senderId, receiverId })
      .orWhere({ senderId: receiverId, receiverId: senderId })
      .first()

    if (!chat) {
      return await this.create({ senderId, receiverId })
    }

    return chat
  }

  static async getChatWithMessages({
    senderId,
    receiverId,
  }: {
    senderId: number
    receiverId: number
  }) {
    const chat = await this.query()
      .preload('messages')
      .preload('sender')
      .preload('receiver')
      .where({ senderId: senderId, receiverId: receiverId })
      .first()

    return chat?.serialize({
      fields: {
        omit: ['senderId', 'receiverId'],
      },
    })
  }

  static async sendMessage({
    senderId,
    receiverId,
    content,
  }: {
    senderId: number
    receiverId: number
    content: string
  }) {
    const chat = await this.getChat({ senderId, receiverId })
    const message = await chat.related('messages').create({ content, senderId })
    await message.load('sender')

    return message
  }
}
