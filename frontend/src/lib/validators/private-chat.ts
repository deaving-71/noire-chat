import { z } from "zod"

import { UserValidator } from "./user"

export const privateChatMessageValidator = z.object({
  id: z.number(),
  privateChatId: z.number(),
  senderId: z.number(),
  content: z.string(),
  sender: UserValidator,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const privateChatValidator = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  sender: UserValidator,
  receiver: UserValidator,
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(privateChatMessageValidator),
})
