import ws from '#services/ws'
import { Socket } from 'socket.io'
import cookie from 'cookie'
import redis from '@adonisjs/redis/services/main'
import logger from '@adonisjs/core/services/logger'
import * as json from 'node:querystring'
import { userValidator } from '#validators/user'
import friendRequestHandlers from '#listeners/friend_request'
import privateChatHandlers from '#listeners/private_chat'
import User from '#models/user'

ws.boot()

export const io = ws.io

io.use(authenticate)
io.use(updateUserStatusMiddleware)

io.on('connection', onConnection)

function onConnection(socket: Socket) {
  logger.info(`socket connected: ${socket.id}`)

  friendRequestHandlers(io, socket)
  privateChatHandlers(io, socket)

  socket.on('disconnect', () => onDisconnection(socket))
}

/**
 * authenticating user socket
 */
async function authenticate(socket: Socket, next: (err?: Error) => void) {
  try {
    await getSocketUser(socket)
    next()
    return
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

async function updateUserStatusMiddleware(socket: Socket, next: (err?: Error) => void) {
  try {
    await updateUserStatus(socket.data.user.id, true)
    next()
  } catch (error) {
    logger.error(error)
    next(error)
  }
}

async function updateUserStatus(userId: number, isOnline: boolean) {
  const user = await User.find(userId)

  if (!user) {
    throw new Error('User not found')
  }

  user.isOnline = isOnline
  await user.save()
}

async function getSocketUser(socket: Socket) {
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

async function onDisconnection(socket: Socket) {
  logger.info(`socket disconnected: ${socket.id}`)

  const userId = socket.data.user?.id
  await redis.lrem(userId, 1, socket.id)
  await updateUserStatus(userId, false)
}
