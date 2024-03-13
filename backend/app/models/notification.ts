import { DateTime } from 'luxon'
import { BaseModel, afterFetch, beforeSave, belongsTo, column } from '@adonisjs/lucid/orm'
import { stringify, parse } from 'flatted'
import User from './user.js'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  @column()
  declare privateChats: number[]

  @column()
  declare friendRequests: number[]

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  /*
  @afterFetch()
  static async parseyArrays(notifications: Notification[]) {
    await Promise.all(
      notifications.map((notification) => {
        if (!notification) return

        if (notification.privateChats) {
          notification.privateChats = parse(notification.privateChats)
        }

        if (notification.friendRequests) {
          notification.friendRequests = parse(notification.friendRequests)
        }
        return notification
      })
    )
  }

  @beforeSave()
  public static async stringifyArrays(notification: Notification) {
    notification.privateChats = stringify(notification.privateChats)
    notification.friendRequests = stringify(notification.friendRequests)
  }
  */
}
