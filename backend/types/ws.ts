import { Socket } from 'socket.io'

export type NextMiddleware = (err?: Error) => void

export type SocketMiddlware = (socket: Socket, next: NextMiddleware) => void
