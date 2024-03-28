import Friend from '#models/friend'
import PrivateChat from '#models/private_chat'
import { privateChatMessageValidator } from '#validators/private_chat'
import { Infer } from '@vinejs/vine/types'
import { Server, Socket } from 'socket.io'
import logger from '@adonisjs/core/services/logger'
import redis from '@adonisjs/redis/services/main'
import Notification from '#models/notification'

export default function privateChatHandlers(io: Server, socket: Socket) {
  socket.on('private-chat:send-message', sendMessage)

  async function sendMessage(data: Infer<typeof privateChatMessageValidator>) {
    try {
      const { content, receiverId } = await privateChatMessageValidator.validate(data)
      const senderId = socket.data.user.id
      const areFriends = await Friend.areFriends({
        receiverId: receiverId,
        senderId: senderId,
      })

      if (!areFriends) {
        return socket.emit('error', 'You are not friends with this user.')
      }

      const message = await PrivateChat.sendMessage({ content, receiverId, senderId })
      const notifications = await Notification.findBy('userId', receiverId)

      const receiverSockets = await redis.lrange(String(receiverId), 0, -1)
      const senderSockets = await redis.lrange(String(senderId), 0, -1)
      const sockets = [...receiverSockets, ...senderSockets]

      if (notifications) {
        const notificationsJSON = notifications.serialize()
        if (!notificationsJSON.privateChats.includes(message.privateChatId)) {
          notifications.privateChats = [...notificationsJSON.privateChats, message.privateChatId]
          await notifications.save()

          const { privateChats, friendRequestsCount } = notifications
          io.to(receiverSockets).emit('notification', { privateChats: JSON.parse(privateChats), friendRequestsCount })
        }
      }

      io.to(sockets).emit('private-chat:message-received', message.serialize())
    } catch (error) {
      logger.error(error)
      socket.emit('error', error)
    }
  }
}
