import { z } from "zod"

import { UserValidator } from "./user"

export const channelMessageValidator = z.object({
  id: z.number(),
  content: z.string(),
  channelId: z.number(),
  sender: UserValidator,
  createdAt: z.string(),
})

export const channelValidator = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  owner: UserValidator,
  createdAt: z.string(),
})

export const channelMembersValidator = z.object({
  online: z.array(UserValidator),
  offline: z.array(UserValidator),
})
