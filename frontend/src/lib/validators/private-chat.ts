import { z } from "zod"

import { userValidator } from "./user"

export const privateChatMessageValidator = z.object({
  id: z.number(),
  privateChatId: z.number(),
  senderId: z.number(),
  content: z.string(),
  sender: z.lazy(() => userValidator),
  status: z.enum(["pending", "sent"]).optional(),
  createdAt: z.string().optional(),
})

export const privateChatValidator = z.object({
  id: z.number(),
  senderId: z.number(),
  receiverId: z.number(),
  sender: z.lazy(() => userValidator),
  receiver: z.lazy(() => userValidator),
  createdAt: z.string(),
  messages: z.array(privateChatMessageValidator),
})

export const allPrivateChatsValidator = z.array(
  privateChatValidator.omit({ messages: true }).extend({
    last_message: privateChatMessageValidator.omit({
      id: true,
      privateChatId: true,
      senderId: true,
    }),
  })
)
