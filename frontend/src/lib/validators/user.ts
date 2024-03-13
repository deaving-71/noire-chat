import { z } from "zod"

export const UserValidator = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  avatar: z.string(),
  isOnline: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
