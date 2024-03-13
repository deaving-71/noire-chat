import vine from '@vinejs/vine'

export const privateChatMessageValidator = vine.compile(
  vine.object({
    receiverId: vine.number(),
    content: vine.string(),
  })
)
