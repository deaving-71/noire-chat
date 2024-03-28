import { z } from "zod"

import { userValidator } from "./user"

export const privateChatMessageValidator = z.object({
  id: z.number(),
  privateChatId: z.number(),
  senderId: z.number(),
  content: z.string(),
  sender: z.lazy(() => userValidator),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const privateChatValidator = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  sender: z.lazy(() => userValidator),
  receiver: z.lazy(() => userValidator),
  createdAt: z.string(),
  updatedAt: z.string(),
  messages: z.array(privateChatMessageValidator),
})
