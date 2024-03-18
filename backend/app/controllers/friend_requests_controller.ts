import Friend from '#models/friend'
import FriendRequest from '#models/friend_request'
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
      return { message: 'Username seem to be incorrect, double check it please' }
    }

    const receiver = await User.query().where('username', receiverUsername).first()
    if (!receiver) {
      return response.status(404).send({
        error: 'NOT_FOUND',
        message: 'Username seem to be incorrect, double check it please',
      })
    }

    const ids = { senderId: user.id, receiverId: receiver.id }

    const areFriends = await Friend.areFriends(ids)
    if (areFriends) {
      return response.status(400).send({
        error: 'BAD_REQUEST',
        message: 'You are already friends with this user',
      })
    }

    const requestExists = await FriendRequest.get(ids)
    if (requestExists) {
      return response.status(400).send({
        error: 'INVALID_RESOURCE',
        message: 'Request already sent',
      })
    }

    const friendRequest = await FriendRequest.create(ids)

    const sockets = await redis.lrange(String(receiver.id), 0, -1)
    io.to(sockets).emit('friend-request:received', {
      ...friendRequest.serialize(),
      sender: user.serialize(),
    })
    return { ...friendRequest.serialize(), receiver }
  }

  async destroy({ auth, request }: HttpContext) {
    const { params } = await request.validateUsing(destroyFriendRequestValidator)
    const { userId } = params
    console.log('userId: ', userId)

    const userTwoId = auth.user!.id
    const friendRequest = await FriendRequest.delete({ userOneId: userId, userTwoId })

    const sockets = await redis.lrange(String(userId), 0, -1)

    io.to(sockets).emit('friend-request:removed', friendRequest?.id)
  }
}
