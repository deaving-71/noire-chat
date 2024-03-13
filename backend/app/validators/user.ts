import vine from '@vinejs/vine'

export const userValidator = vine.compile(
  vine.object({
    id: vine.number(),
    username: vine.string(),
    email: vine.string(),
    createdAt: vine.string(),
    updatedAt: vine.string(),
  })
)

export const receiverIdValidator = vine.compile(
  vine.object({
    receiverId: vine.number(),
  })
)
