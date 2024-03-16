import { updateMembershipValidator } from '#validators/membership'
import type { HttpContext } from '@adonisjs/core/http'
import Channel from '#models/channel'
import { io } from '#start/socket'

export default class MembershipsController {
  async update({ auth, request }: HttpContext) {
    const user = auth.user

    if (!user) throw new Error('User not found')

    const { params } = await request.validateUsing(updateMembershipValidator)
    const { slug } = params

    const channel = await Channel.query().where({ slug }).first()

    if (!channel) throw new Error('Channel not found')

    const isMember = await user.related('channels').query().where({ id: channel.id }).first()

    if (isMember) throw new Error('Already a member')

    await user.related('channels').attach([channel.id])

    io.emit('channel:join-channel', user, channel.id)

    return channel
  }
}
