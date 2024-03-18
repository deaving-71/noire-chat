import Channel from '#models/channel'
import User from '#models/user'
import { channelMessageValidator } from '#validators/channel'
import logger from '@adonisjs/core/services/logger'
import vine from '@vinejs/vine'
import { Server, Socket } from 'socket.io'

const slugValidator = vine.compile(vine.string().minLength(8))

export default function channelHandlers(io: Server, socket: Socket) {
  socket.on('channel:join-room', join)
  socket.on('channel:send-message', sendMessage)

  async function join(data: any) {
    try {
      const slug = await slugValidator.validate(data)

      const channel = await Channel.findBy('slug', slug)
      if (!channel) {
        socket.emit('error', 'Channel does not exist')
        return
      }

      const userId = socket.data.user.id
      const user = await User.find(userId)

      const isMember = await user!.related('channels').query().where({ id: channel.id }).first()

      if (!isMember) {
        socket.emit('error', 'You are not a member of this channel')
        return
      }

      io.to(slug).emit('channel:user-connected', userId) // send user's id who went online to we can change their status in the member list
      socket.join(slug)
    } catch (err) {
      logger.error(err)
      socket.emit('error', err)
    }
  }

  async function sendMessage(data: any) {
    try {
      const { content, slug } = await channelMessageValidator.validate(data)
      const senderId = socket.data.user.id

      const channel = await Channel.findBy('slug', slug)
      if (!channel) {
        socket.emit('error', 'Channel does not exist')
        return
      }

      const _message = await channel.related('messages').create({ content, senderId })
      logger.info(_message.$isPersisted)
      const _sender = await _message.related('sender').query().first()
      const message = _message.serialize()
      const sender = _sender?.serialize()

      io.to(slug).emit('channel:message-received', { ...message, sender })
    } catch (err) {
      logger.error(err)
      socket.emit('error', err)
    }
  }
}
