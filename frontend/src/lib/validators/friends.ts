import { z } from "zod"

import { userValidator } from "./user"

export const friendsValidator = z.object({
  online: z.array(userValidator),
  offline: z.array(userValidator),
})
