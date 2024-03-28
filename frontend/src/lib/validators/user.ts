import { z } from "zod"

import { channelValidator } from "./channel"

export const userValidator = z.object({
  id: z.number(),
  username: z.string(),
  email: z.string(),
  avatar: z.string(),
  isOnline: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const profileValidator = z.object({
  profile: userValidator,
  channels: z.array(
    z.lazy(() =>
      channelValidator
        .omit({
          owner: true,
        })
        .extend({
          unreadMessages: z.number(),
        })
    )
  ),
})
