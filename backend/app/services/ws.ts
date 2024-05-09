import { Server } from 'socket.io'
import AdonisServer from '@adonisjs/core/services/server'
import { ALLOWED_ORIGINS } from '#config/cors'

class Ws {
  //@ts-ignore
  io: Server
  private booted = false

  boot() {
    /**
     * Ignore multiple calls to the boot method
     */
    if (this.booted) {
      return
    }

    this.io = new Server(AdonisServer.getNodeServer(), {
      cors: {
        origin: ALLOWED_ORIGINS,
        methods: ['GET', 'POST'],
        credentials: true,
      },
      cookie: {
        name: 'io',
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      },
    })
    this.booted = true
  }
}

export default new Ws()
