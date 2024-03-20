import ws from '#services/ws'
import { Socket } from 'socket.io'
import cookie from 'cookie'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import * as json from 'node:querystring'
import { userValidator } from '#validators/user'
import privateChatHandlers from '#listeners/private_chat'
import User from '#models/user'
import channelHandlers from '#listeners/channel'
import { NextMiddleware } from '#types/ws'

ws.boot()

export const io = ws.io

io.use(authenticate)
io.use(updateUserStatusMiddleware)
io.use(joinChannels)
io.on('connection', onConnection)

function onConnection(socket: Socket) {
  logger.info(`socket connected: ${socket.id}`)

  privateChatHandlers(io, socket)
  channelHandlers(io, socket)

  socket.on('disconnect', () => onDisconnection(socket))
}

/*
|--------------------------------------------------------------------------
| Socket middlwares
|--------------------------------------------------------------------------
*/

async function authenticate(socket: Socket, next: NextMiddleware) {
  try {
    await registerUserSocket(socket)
    return next()
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

async function updateUserStatusMiddleware(socket: Socket, next: NextMiddleware) {
  try {
    const userId = socket.data.user.id

    await updateUserStatus(userId, true)
    broadcastUserStatus('friend-connected', socket)
    next()
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

async function joinChannels(socket: Socket, next: NextMiddleware) {
  try {
    const userId = socket.data.user.id
    const user = await User.find(userId)

    if (!user) throw new Error('User not found')

    const channels = await user.related('channels').query()

    const slugs = channels.map((c) => c.slug)

    socket.join(slugs)
    io.to(slugs).emit('member-connected', user.id)

    next()
  } catch (error) {
    logger.error(error)
    next(error)
  }
}
/* -------------------------------------------------------------------------- */

async function updateUserStatus(userId: number, status: boolean) {
  const user = await User.find(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.isOnline = status
  await user.save()
}

async function registerUserSocket(socket: Socket) {
  const cookies = socket.handshake.headers.cookie
  if (!cookies) {
    throw new Error('Action unauthorized')
  }

  const parsedCookies = cookie.parse(cookies)

  const sessionId = parsedCookies['adonis-session']
  const userDataAsString = parsedCookies['noirechat-userdata']

  if (!sessionId || !userDataAsString) {
    throw new Error('Action unauthorized')
  }

  const user = await userValidator.validate(json.parse(userDataAsString))

  socket.data.session = sessionId
  socket.data.user = user
  await redis.rpush(String(user.id), socket.id)
}

async function broadcastUserStatus(
  event: 'friend-connected' | 'friend-disconnected',
  socket: Socket
) {
  const userId = socket.data.user.id
  const user = await User.find(userId)

  if (!user) throw new Error('User not found')

  const friends = await user!.related('friends').query().where('isOnline', true)

  const sockets: string[] = []
  for (let friend of friends) {
    const friendSockets = await redis.lrange(String(friend.id), 0, -1)
    sockets.push(...friendSockets)
  }

  io.to(sockets).emit(event, user)
}

async function onDisconnection(socket: Socket) {
  logger.info(`socket disconnected: ${socket.id}`)

  const userId = socket.data.user?.id
  await redis.lrem(userId, 1, socket.id)

  const stillConnected = await redis.exists(userId)
  if (stillConnected) return

  await updateUserStatus(userId, false)
  broadcastUserStatus('friend-disconnected', socket)
}
