import { DateTime } from 'luxon'
import User from '#models/user'
import ChannelMessage from '#models/channel_message'
import { BaseModel, belongsTo, column, hasMany, manyToMany } from '@adonisjs/lucid/orm'
import type { BelongsTo, HasMany, ManyToMany } from '@adonisjs/lucid/types/relations'

export default class Channel extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare name: string

  @column()
  declare slug: string

  @column({ serializeAs: null })
  declare ownerId: number

  @belongsTo(() => User, { foreignKey: 'ownerId' })
  declare owner: BelongsTo<typeof User>

  @hasMany(() => ChannelMessage)
  declare messages: HasMany<typeof ChannelMessage>

  @manyToMany(() => User, {
    pivotTable: 'membership',
    localKey: 'id',
    pivotForeignKey: 'member_id',
    relatedKey: 'id',
    pivotRelatedForeignKey: 'channel_id',
  })
  declare members: ManyToMany<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime
}
