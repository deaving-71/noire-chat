import Friend from '#models/friend'
import FriendRequest from '#models/friend_request'
import Notification from '#models/notification'
import User from '#models/user'
import { io } from '#start/socket'
import {
  storeFriendRequestValidator,
  destroyFriendRequestValidator,
} from '#validators/friend_request'
import type { HttpContext } from '@adonisjs/core/http'
import redis from '@adonisjs/redis/services/main'

export default class FriendRequestsController {
  async store({ request, auth, response }: HttpContext) {
    const { receiverUsername } = await request.validateUsing(storeFriendRequestValidator)

    const user = auth.user!
    if (user.username === receiverUsername) {
      return response.badRequest({
        message: 'Username seem to be incorrect, double check it please',
      })
    }

    const receiver = await User.query().where('username', receiverUsername).first()
    if (!receiver) {
      return response.badRequest({
        message: 'Username seem to be incorrect, double check it please',
      })
    }

    const ids = { senderId: user.id, receiverId: receiver.id }

    const areFriends = await Friend.areFriends(ids)
    if (areFriends) {
      return response.badRequest({ message: 'You are already friends with this user' })
    }

    const requestExists = await FriendRequest.get(ids)
    if (requestExists) {
      return response.badRequest({ message: 'Request already sent' })
    }

    const friendRequest = await FriendRequest.create(ids)
    const notifications = await receiver.related('notifications').query().first()

    /* //? every user has their own notication row created for them when they register */
    if (!notifications) {
      return response.internalServerError({
        message: 'Something went wrong, please try again later',
      })
    }

    notifications.friendRequestsCount = notifications?.friendRequestsCount + 1
    await notifications.save()

    const sockets = await redis.lrange(String(receiver.id), 0, -1)
    io.to(sockets).emit('friend-request:received', {
      ...friendRequest.serialize(),
      sender: user.serialize(),
    })

    const { friendRequestsCount, privateChats } = notifications
    io.to(sockets).emit('notification', {
      friendRequestsCount,
      privateChats: JSON.parse(privateChats),
    })

    return { ...friendRequest.serialize(), receiver }
  }

  async destroy({ auth, request, response }: HttpContext) {
    //? isSender refers to the user who is making the request
    const { params, isSender = false } = await request.validateUsing(destroyFriendRequestValidator)
    const { userId: userOneId } = params

    const userTwoId = auth.user!.id
    const friendRequest = await FriendRequest.delete({ userOneId, userTwoId })

    const notifications = await Notification.findBy('userId', isSender ? userOneId : userTwoId)

    if (!notifications) {
      return response.internalServerError({
        message: 'Something went wrong, please try again later',
      })
    }

    notifications.friendRequestsCount = notifications?.friendRequestsCount - 1
    await notifications.save()
    const sockets = await redis.lrange(String(userOneId), 0, -1)

    io.to(sockets).emit('friend-request:removed', friendRequest?.id)

    if (isSender) {
      const { friendRequestsCount, privateChats } = notifications
      io.to(sockets).emit('notification', {
        friendRequestsCount,
        privateChats: JSON.parse(privateChats),
      })
    }
  }
}
