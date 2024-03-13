import FriendRequest from '#models/friend_request'
import User from '#models/user'
import type { HttpContext } from '@adonisjs/core/http'

export default class FriendsController {
  async index({ auth }: HttpContext) {
    const userId = auth.user?.id

    if (!userId) throw new Error('User not found')

    const friends = await User.getFriendList(userId)
    const friend_requests = await FriendRequest.getUserFriendRequests(userId)

    return { friends, friend_requests }
  }
}
