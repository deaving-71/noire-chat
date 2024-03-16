import { DateTime } from 'luxon'
import User from '#models/user'
import Channel from '#models/channel'
import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class ChannelMessage extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare channelId: number

  @column()
  declare senderId: number

  @column()
  declare content: string

  @belongsTo(() => User, { foreignKey: 'senderId' })
  declare sender: BelongsTo<typeof User>

  @belongsTo(() => Channel, { foreignKey: 'channelId' })
  declare channel: BelongsTo<typeof Channel>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
