import { io } from "socket.io-client"

import { env } from "@/env.mjs"

export class Ws {
  socket: ReturnType<typeof io>

  constructor() {
    this.socket = io(env.NEXT_PUBLIC_SOCKET_URL, {
      withCredentials: true,
      autoConnect: false,
    })
  }

  boot(cb?: () => void) {
    this.socket.connect()
    this.socket.on("connect", () => {
      cb && cb()
    })
    this.socket.on("connect_error", (err) => {
      console.error(`connect_error due to ${err.message}`)
    })
  }

  sendPrivateMessage(data: {
    receiverId: number
    content: string
    messageId: number
  }) {
    this.socket.emit("private-chat:send-message", data)
  }

  sendChannelMessage(data: { slug: string; content: string }) {
    this.socket.emit("channel:send-message", data)
  }

  joinChannel(slug: string) {
    this.socket.emit("channel:join-room", slug)
  }
}
