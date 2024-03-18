import vine from '@vinejs/vine'

export const storeFriendValdiator = vine.compile(
  vine.object({
    senderId: vine.number(),
  })
)

export const storeFriendRequestValidator = vine.compile(
  vine.object({ receiverUsername: vine.string() })
)

export const destroyFriendRequestValidator = vine.compile(
  vine.object({
    params: vine.object({
      userId: vine.number(),
    }),
  })
)
