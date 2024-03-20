import { useUser } from "@/_stores/user"
import { Callback } from "@/types"
import { io } from "socket.io-client"

export class Ws {
  socket: ReturnType<typeof io>

  constructor() {
    //! use env url from t3-oss
    // @ts-ignore
    this.socket = io("http://127.0.0.1:3333", {
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

  sendPrivateMessage(data: { receiverId: number; content: string }) {
    this.socket.emit("private-chat:send-message", data)
  }

  sendChannelMessage(data: { slug: string; content: string }) {
    this.socket.emit("channel:send-message", data)
  }
}
