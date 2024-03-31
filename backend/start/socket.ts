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

/* 
! a bug occurs when multiple sockets are connected
*/
io.use(registerSocket)
io.on('connection', onConnection)

function onConnection(socket: Socket) {
  logger.info(`socket connected: ${socket.id}`)

  privateChatHandlers(io, socket)
  channelHandlers(io, socket)

  socket.on('disconnect', () => onDisconnection(socket))
}

async function registerSocket(socket: Socket, next: NextMiddleware) {
  try {
    const user = await getUser(socket)
    socket.data.user = user

    const isConnected = await redis.exists(String(user.id))
    await redis.rpush(String(user.id), socket.id)

    await handleUserStatusChange(socket, true, !isConnected)

    next()
  } catch (error) {
    next(error)
    logger.error(error)
  }
}

async function onDisconnection(socket: Socket) {
  logger.info(`socket disconnected: ${socket.id}`)

  const userId = socket.data.user?.id
  await redis.lrem(userId, 1, socket.id)

  const isConnected = await redis.exists(userId)

  handleUserStatusChange(socket, false, !isConnected)
}

async function handleUserStatusChange(socket: Socket, status: boolean, canEmit: boolean) {
  try {
    const userId = socket.data.user.id

    const user = await User.query()
      .where('id', userId)
      .preload('friends', (friendsQuery) => {
        friendsQuery.select(['id'])
      })
      .preload('channels', (channelsQuery) => {
        channelsQuery.select(['slug'])
      })
      .first()

    if (!user) {
      throw new Error('User not found')
    }

    const friendsIds = user.friends.map((friend) => friend.id)
    const channels = user.channels.map((channel) => channel.slug)

    const friendsSockets: string[] = []
    for (let friendId of friendsIds) {
      const friendSockets = await redis.lrange(String(friendId), 0, -1)
      friendsSockets.push(...friendSockets)
    }

    socket.join(channels)

    if (canEmit) {
      user.isOnline = status
      await user.save()

      io.to(friendsSockets).emit(status ? 'friend-connected' : 'friend-disconnected', user)
      io.to(channels).emit('member-update-status', user.id, status)
    }
  } catch (error) {
    logger.error(error)
  }
}

async function getUser(socket: Socket) {
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

  return await userValidator.validate(json.parse(userDataAsString))
}
