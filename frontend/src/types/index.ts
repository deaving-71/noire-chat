import { z } from "zod"

import {
  channelMessageValidator,
  channelValidator,
} from "@/lib/validators/channel"
import {
  incomingFriendRequest,
  outgoingFriendRequest,
} from "@/lib/validators/friend_request"
import { notificationsValidator } from "@/lib/validators/notifcations"
import {
  privateChatMessageValidator,
  privateChatValidator,
} from "@/lib/validators/private-chat"
import { userValidator } from "@/lib/validators/user"

export type User = z.infer<typeof userValidator>

export type FriendsList = {
  online: User[]
  offline: User[]
}

export type IncomingFriendRequest = z.infer<typeof incomingFriendRequest>
export type OutgoingFriendRequest = z.infer<typeof outgoingFriendRequest>

export type FriendRequests = {
  outgoing: OutgoingFriendRequest[]
  incoming: IncomingFriendRequest[]
}

export type PrivateChat = z.infer<typeof privateChatValidator>
export type PrivateChatMessage = z.infer<typeof privateChatMessageValidator>
export type PrivateChatHistory = Omit<PrivateChat, "messages"> & {
  last_message: PrivateChatMessage
}

export type Channel = z.infer<typeof channelValidator>
export type ChannelMessage = z.infer<typeof channelMessageValidator>

export type Notifications = z.infer<typeof notificationsValidator>

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

export type SiteConfig = {
  name: string
  author: string
  description: string
  keywords: Array<string>
  url: {
    base: string
    author: string
  }
  links: {
    github: string
  }
  ogImage: string
}
