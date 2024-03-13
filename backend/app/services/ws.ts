import { Server } from 'socket.io'
import AdonisServer from '@adonisjs/core/services/server'

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
        origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
        methods: ['GET', 'POST'],
        credentials: true,
      },
      cookie: true,
    })
    this.booted = true
  }
}

export default new Ws()
