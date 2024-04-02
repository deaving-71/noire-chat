import { z } from "zod"

export const formValidationErrorValidator = z.object({
  errors: z.array(
    z.object({
      message: z.string(),
      field: z.string(),
      rule: z.string(),
    })
  ),
})

export const requestErrorValidator = z.object({
  message: z.string(),
})
