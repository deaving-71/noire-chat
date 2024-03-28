import { DateTime } from 'luxon'
import { withAuthFinder } from '@adonisjs/auth'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, hasMany, hasOne, manyToMany } from '@adonisjs/lucid/orm'
import PrivateChatMessage from '#models/private_chat_message'
import Channel from '#models/channel'
import PrivateChat from '#models/private_chat'
import Notification from '#models/notification'
import type { HasMany, HasOne, ManyToMany } from '@adonisjs/lucid/types/relations'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder) {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare username: string

  @column()
  declare email: string

  @column()
  declare avatar: string

  @column()
  declare isOnline: boolean

  @column({ serializeAs: null })
  declare status: boolean

  @column({ serializeAs: null })
  declare password: string

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime | null

  @manyToMany(() => User, {
    pivotTable: 'friends',
    pivotForeignKey: 'user_id',
    pivotRelatedForeignKey: 'friend_id',
  })
  declare friends: ManyToMany<typeof User>

  @manyToMany(() => User, {
    pivotTable: 'friends',
    pivotForeignKey: 'friend_id',
    pivotRelatedForeignKey: 'user_id',
  })
  declare friendsOf: ManyToMany<typeof User>

  @manyToMany(() => Channel, {
    pivotTable: 'channel_members',
    pivotColumns: ['last_seen_messages'],
  })
  declare channels: ManyToMany<typeof Channel>

  @hasMany(() => Channel, { foreignKey: 'ownerId' })
  declare owned_channels: HasMany<typeof Channel>

  @hasMany(() => PrivateChat, { foreignKey: 'senderId' })
  declare sentPrivateChats: HasMany<typeof PrivateChat>

  @hasMany(() => PrivateChat, { foreignKey: 'receiverId' })
  declare receivedPrivateChats: HasMany<typeof PrivateChat>

  @hasMany(() => PrivateChatMessage, { foreignKey: 'senderId' })
  declare privateChatMessages: HasMany<typeof PrivateChatMessage>

  @hasOne(() => Notification)
  declare notifications: HasOne<typeof Notification>

  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  static async getUser(userId: number) {
    const user = await this.query().where('id', userId).preload('channels').first()

    const { channels, owned_channels, ...profile } = user?.serialize()!

    return {
      profile,
      channels,
    }
  }

  static async getFriendList(userId: number) {
    const user = await this.find(userId)
    const online = await user?.related('friends').query().where('isOnline', true)
    const offline = await user?.related('friends').query().where('isOnline', false)

    return { online, offline }
  }

  static async addFriend({ friendId, userId }: { userId: number; friendId: number }) {
    const userPromise = this.findOrFail(userId)
    const friendPromise = this.findOrFail(friendId)

    const [user, friend] = await Promise.all([userPromise, friendPromise])

    await Promise.all([
      user.related('friends').attach([friend.id]),
      friend.related('friends').attach([user.id]),
    ])
  }
}
