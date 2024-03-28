import {
  afterFetch,
  afterFind,
  afterSave,
  BaseModel,
  beforeCreate,
  beforeSave,
  beforeUpdate,
  belongsTo,
  column,
} from '@adonisjs/lucid/orm'
import User from '#models/user'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

  @column()
  declare userId: number

  /**
   * friend requests received
   */
  @column()
  declare friendRequestsCount: number

  @column()
  declare privateChats: number[]

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @beforeCreate()
  @beforeUpdate()
  @beforeSave()
  static async stringifyArrays(notification: Notification) {
    //@ts-ignore
    notification.privateChats = JSON.stringify(notification.privateChats)
  }

  @afterFetch()
  static async parseArrays(notifications: Notification[]) {
    notifications.forEach((notification) => {
      //@ts-ignore
      notification.privateChats = JSON.parse(notification.privateChats)
    })
  }

  @afterSave()
  @afterFind()
  static async parse(notification: Notification) {
    //@ts-ignore
    notification.privateChats = JSON.parse(notification.privateChats)
  }
}
