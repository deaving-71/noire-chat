import Notification from '#models/notification'
import { Callback } from '#types/listeners'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import vine from '@vinejs/vine'
import { Server, Socket } from 'socket.io'

//TODO: save notification in db
export function notificationHandlers(io: Server, socket: Socket) {
  socket.on('notification:friend-request-viewed', removeFriendRequestNotification)
  socket.on('notification:private-chat-message-seen', removePrivateChatMessageNotification)

  async function removeFriendRequestNotification(data: any, cb?: Callback) {
    const schema = vine.number()

    const requestId = await vine.validate({ schema, data })
    const userId = socket.data.user.id
    const notifications = await Notification.query().where('userId', userId).first()
    const index = notifications?.friendRequests.indexOf(requestId)
    if (index !== -1 && index) {
      notifications?.friendRequests.splice(index, 1)
    }

    await notifications?.save()

    cb && cb({ success: true, data: notifications })
  }

  async function removePrivateChatMessageNotification(data: any, cb?: Callback) {
    const schema = vine.number()

    const privateChatId = await vine.validate({ schema, data })

    const userId = socket.data.user.id
    const notifications = await Notification.query().where('userId', userId).first()
    const index = notifications?.privateChats.indexOf(privateChatId)
    if (index !== -1 && index) {
      notifications?.privateChats.splice(index, 1)
    }

    await notifications?.save()
    cb && cb({ success: true, data: notifications })
  }
}

export default class NotificationHandler {
  private io: Server
  private receiverId: number
  private userConenctedSockets?: string[]

  constructor(io: Server, receiverId: number) {
    this.io = io
    this.receiverId = receiverId
  }

  async getUserSockets() {
    if (this.userConenctedSockets) {
      return this.userConenctedSockets
    }

    const sockets = await redis.lrange(String(this.receiverId), 0, -1)
    this.userConenctedSockets = sockets
    return sockets
  }

  async friendRequest(requestId: number) {
    try {
      const sockets = await this.getUserSockets()
      const notifications = await Notification.firstOrCreate({ userId: this.receiverId })

      notifications.friendRequests = notifications.friendRequests
        ? [...notifications.friendRequests, requestId]
        : [requestId]

      await notifications.save()

      this.io.to(sockets).emit('notification:friend-request-received', requestId)
      return this
    } catch (err) {
      logger.error(err)
      return this
    }
  }

  async privateChatMessage(privateChatId: number) {
    const sockets = await this.getUserSockets()
    const notifications = await Notification.firstOrCreate({ userId: this.receiverId })
    notifications.privateChats.push(privateChatId)
    await notifications.save()

    this.io.to(sockets).emit('notification:private-chat-message-received', privateChatId)

    return this
  }
}
