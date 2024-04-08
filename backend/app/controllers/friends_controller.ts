import FriendRequest from '#models/friend_request'
import User from '#models/user'
import { io } from '#start/socket'
import { storeFriendValdiator } from '#validators/friend_request'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class FriendsController {
  async index({ auth }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new Error('User not found')

    const friends = await User.getFriendList(userId)
    const friend_requests = await FriendRequest.getUserFriendRequests(userId)

    return { friends, friend_requests }
  }

  async store({ auth, request, response }: HttpContext) {
    const { senderId } = await request.validateUsing(storeFriendValdiator)
    const receiver = auth.user!
    const receiverId = receiver.id

    const freindRequest = await FriendRequest.get({ receiverId, senderId })
    if (!freindRequest)
      return response.status(404).send({
        message: 'Friend request does not exist',
      })

    await Promise.all([
      FriendRequest.delete({ userOneId: receiverId, userTwoId: senderId }),
      User.addFriend({ userId: receiverId, friendId: senderId }),
    ])

    const sender = await User.find(senderId)
    const notifications = await receiver.related('notifications').query().first()

    if (!notifications) {
      return response.internalServerError({
        message: 'Something went wrong please try again later',
      })
    }
    notifications.friendRequestsCount = notifications.friendRequestsCount - 1
    const newNotifications = await notifications.save()

    const senderSockets = await redis.lrange(String(senderId), 0, -1)
    const receiverSockets = await redis.lrange(String(receiverId), 0, -1)

    io.to(senderSockets).emit('friend-request:accepted', {
      newFriend: receiver.serialize(),
      requestId: freindRequest.id,
    })

    const { friendRequestsCount, privateChats } = newNotifications
    io.to(receiverSockets).emit('notification', {
      friendRequestsCount,
      privateChats,
    })

    return sender
  }

  async destroy() {}
}
