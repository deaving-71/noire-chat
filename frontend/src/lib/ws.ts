import { useUser } from "@/stores/user"
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

  sendFriendRequest(username: string, cb: Callback) {
    this.socket.emit("friend-request:send", username, cb)
  }

  acceptFriendRequest(senderId: number, cb: Callback) {
    this.socket.emit("friend-request:accept", senderId, cb)
  }

  removeFriendRequest(userId: number, cb: Callback) {
    this.socket.emit("friend-request:remove", userId, cb)
  }

  sendPrivateMessage(
    data: {
      receiverId: number
      content: string
    },
    cb: Callback
  ) {
    this.socket.emit("private-chat:send-message", data, cb)
  }
}
