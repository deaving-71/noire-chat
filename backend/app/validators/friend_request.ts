import vine from '@vinejs/vine'

/**
 * userId is either a sender or a receiver
 */
export const friendRequestValidator = vine.compile(vine.number())

export const sendFriendRequestValidator = vine.compile(vine.string())
