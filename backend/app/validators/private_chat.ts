import vine from '@vinejs/vine'

export const privateChatMessageValidator = vine.compile(
  vine.object({
    messageId: vine.number(),
    receiverId: vine.number(),
    content: vine.string(),
  })
)
