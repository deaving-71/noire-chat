import { z } from "zod"

import { UserValidator } from "./user"

export const IncomingFriendRequest = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  sender: UserValidator,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const OutgoingFriendRequest = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  receiver: UserValidator,
  createdAt: z.string(),
  updatedAt: z.string(),
})
