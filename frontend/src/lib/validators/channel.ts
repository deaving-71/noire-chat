import { z } from "zod"

import { userValidator } from "./user"

export const channelMessageValidator = z.object({
  id: z.number(),
  content: z.string(),
  channelId: z.number(),
  sender: z.lazy(() => userValidator),
  createdAt: z.string(),
})

export const channelValidator = z.object({
  id: z.number(),
  name: z.string(),
  slug: z.string(),
  owner: z.lazy(() => userValidator),
  createdAt: z.string(),
})

export const channelMembersValidator = z.object({
  online: z.array(z.lazy(() => userValidator)),
  offline: z.array(z.lazy(() => userValidator)),
})
