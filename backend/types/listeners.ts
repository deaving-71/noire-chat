export type CallbackPayload =
  | {
      success: true
      data: any
    }
  | { success: false; errors?: Record<string, any>; message: string }

export type Callback = (payload: CallbackPayload) => void
