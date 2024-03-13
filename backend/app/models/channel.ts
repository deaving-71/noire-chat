import { DateTime } from 'luxon'
import User from '#models/user'
import ChannelMessage from '#models/channel_message'
import { BaseModel, belongsTo, column, hasMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare inviteLink: string

  @column({ serializeAs: null })
  declare ownerId: number

  @belongsTo(() => User)
  declare owner: BelongsTo<typeof User>

  @hasMany(() => ChannelMessage)
  declare messages: HasMany<typeof ChannelMessage>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
