import { updateMembershipValidator } from '#validators/membership'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import { io } from '#start/socket'

export default class MembershipsController {
  async update({ auth, request, response }: HttpContext) {
    const user = auth.user

    if (!user) {
      return response.abort({
        message: 'You must be logged in to perform this action',
        status: 401,
      })
    }

    const { params } = await request.validateUsing(updateMembershipValidator)
    const { slug } = params

    const channel = await Channel.query().where({ slug }).first()

    if (!channel) {
      return response.abort({ message: 'Channel not found', status: 404 })
    }

    const isMember = await user.related('channels').query().where({ id: channel.id }).first()

    if (isMember) {
      return response.abort({ message: 'You are already a member of this channel' })
    }

    await user.related('channels').attach([channel.id])

    io.emit('channel:member-joined', user, channel.id)

    return channel
  }
}
