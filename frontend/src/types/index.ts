import { timeStamp } from "console"
import { z } from "zod"

import {
  privateChatMessageValidator,
  privateChatValidator,
  UserValidator,
} from "@/lib/validators/"
import {
  channelMembersValidator,
  channelMessageValidator,
  channelValidator,
} from "@/lib/validators/channel"

export type User = z.infer<typeof UserValidator>

export type FriendRequest = {
  id: number
  senderId: number
  receiverId: number
} & Timestamp

export type IncomingFriendRequest = FriendRequest & { sender: User }
export type OutgoingFriendRequest = FriendRequest & { receiver: User }

export type PrivateChat = z.infer<typeof privateChatValidator>
export type PrivateChatMessage = z.infer<typeof privateChatMessageValidator>
export type PrivateChatHistory = Omit<PrivateChat, "messages"> & {
  last_message: PrivateChatMessage
}

export type Channel = z.infer<typeof channelValidator>
export type ChannelMessage = z.infer<typeof channelMessageValidator>
export type ChannelMembers = z.infer<typeof channelMembersValidator>

export type CallbackPayload =
  | {
      success: true
      data: any
    }
  | { success: false; errors?: Record<string, any>; message: string }

export type Callback = (payload: CallbackPayload) => void

export type Timestamp = {
  createdAt: string
  updatedAt: string
}
