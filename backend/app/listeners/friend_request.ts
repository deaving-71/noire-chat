import Friend from '#models/friend'
import FriendRequest from '#models/friend_request'
import User from '#models/user'
import { Callback } from '#types/listeners'
import { friendRequestValidator, sendFriendRequestValidator } from '#validators/friend_request'
import { errors } from '@vinejs/vine'
import { Server, Socket } from 'socket.io'
import Notifcation from '#listeners/notifications'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'

export default function friendRequestHandlers(io: Server, socket: Socket) {
  socket.on('friend-request:send', send)
  socket.on('friend-request:accept', accept)
  socket.on('friend-request:remove', remove) // emit to this listener when trying to reject or cancel

  async function send(data: any, cb?: Callback) {
    try {
      const username = await sendFriendRequestValidator.validate(data)

      if (username === socket.data.user.username) {
        cb &&
          cb({ success: false, message: 'Username seem to be incorrect, double check it please' })
        return
      }

      const user = await User.query().where('username', username).first()

      if (!user) {
        cb &&
          cb({ success: false, message: 'Username seem to be incorrect, double check it please' })
        return
      }

      const ids = { senderId: socket.data.user.id, receiverId: user.id }

      const areFriends = await Friend.areFriends(ids)

      if (areFriends) {
        cb && cb({ success: false, message: 'You are already friends with this user' })
        return
      }

      const requestExists = await FriendRequest.get(ids)
      if (requestExists) {
        cb && cb({ success: false, message: 'Request already sent' })
        return
      }

      const friendRequest = await FriendRequest.create(ids)

      const models = await Promise.all([
        friendRequest.related('sender').query().first(),
        friendRequest.related('receiver').query().first(),
      ])

      const [sender, receiver] = models
      const senderJSON = sender?.serialize()
      const receiverJSON = receiver?.serialize()
      const friendRequestJSON = friendRequest.serialize()

      const notify = new Notifcation(io, ids.receiverId)
      const sockets = await notify.getUserSockets()

      // await notify.friendRequest(friendRequest.id)
      io.to(sockets).emit('friend-request:received', { ...friendRequestJSON, sender: senderJSON })
      cb && cb({ success: true, data: { ...friendRequestJSON, receiver: receiverJSON } })
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        cb && cb({ success: false, message: 'Validation error', errors: { ...error.messages } })
      }
    }
  }

  async function accept(data: any, cb?: Callback) {
    try {
      const senderId = await friendRequestValidator.validate(data)
      const receiverId = socket.data.user.id

      const request = await FriendRequest.get({ receiverId, senderId })
      if (!request) {
        cb && cb({ success: false, message: 'Friend request does not exist' })
        return
      }

      await Promise.all([
        FriendRequest.delete({ userOneId: receiverId, userTwoId: senderId }),
        User.addFriend({ userId: receiverId, friendId: senderId }),
      ])

      const [sender, receiver] = await Promise.all([User.find(senderId), User.find(receiverId)])

      const sockets = await redis.lrange(String(senderId), 0, -1)

      io.to(sockets).emit('friend-request:accepted', {
        user: receiver?.serialize(),
        requestId: request.id,
      })
      cb && cb({ success: true, data: { user: sender?.serialize() } })
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        cb && cb({ success: false, message: 'Validation error', errors: { ...error.messages } })
      }
    }
  }

  async function remove(data: any, cb?: Callback) {
    try {
      const userId = await friendRequestValidator.validate(data)

      const userTwoId = socket.data.user.id
      const request = await FriendRequest.delete({ userOneId: userId, userTwoId })

      const sockets = await redis.lrange(String(userId), 0, -1)

      io.to(sockets).emit('friend-request:removed', request?.id)
      cb && cb({ success: true, data: null })
    } catch (error) {
      logger.error(error)
      if (error instanceof errors.E_VALIDATION_ERROR) {
        cb && cb({ success: false, message: 'Validation error', errors: { ...error.messages } })
      }
    }
  }
}
