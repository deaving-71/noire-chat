import { io } from "socket.io-client"

export class Ws {
  socket: ReturnType<typeof io>

  constructor() {
    //! use env url from t3-oss
    // @ts-ignore
    this.socket = io("https://noire-chat.onrender.com", {
      withCredentials: true,
      autoConnect: false,
    })
  }

  boot(cb?: () => void) {
    this.socket.connect()
    this.socket.on("connect", () => {
      cb && cb()
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
