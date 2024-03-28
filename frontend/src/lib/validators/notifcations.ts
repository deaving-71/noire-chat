import { z } from "zod"

export const notificationsValidator = z.object({
  friendRequestsCount: z.number(),
  privateChats: z.array(z.number()),
})
