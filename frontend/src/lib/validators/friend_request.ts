import { z } from "zod"

import { userValidator } from "./user"

export const incomingFriendRequest = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  sender: userValidator,
})

export const outgoingFriendRequest = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  receiver: userValidator,
})
