import { toast } from "react-hot-toast"
import { z } from "zod"

import logger from "./logger"
import {
  formValidationErrorValidator,
  requestErrorValidator,
} from "./validators/error"

type RequestError = z.infer<typeof formValidationErrorValidator>
export function errorHandler(error: unknown, cb?: (err: RequestError) => void) {
  const requestError = requestErrorValidator.safeParse(error)
  if (requestError.success) {
    toast.error(requestError.data.message)
    return
  }

  const formErrors = formValidationErrorValidator.safeParse(error)
  if (formErrors.success) {
    cb && cb(formErrors.data)
    return
  }

  logger.error(error)
}
