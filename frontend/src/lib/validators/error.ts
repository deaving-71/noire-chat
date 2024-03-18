import { z } from "zod"

export const responseErrorValdiator = z.object({
  error: z.string(),
  message: z.string(),
})
