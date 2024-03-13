import { DateTime } from 'luxon'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import PrivateChat from '#models/private_chat'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class PrivateChatMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare privateChatId: number

  @column()
  declare senderId: number

  @column()
  declare content: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => PrivateChat, { foreignKey: 'privateChatId' })
  declare privateChat: BelongsTo<typeof PrivateChat>
}
