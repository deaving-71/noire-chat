import vine from '@vinejs/vine'

export const updateMembershipValidator = vine.compile(
  vine.object({
    params: vine.object({
      invite_link: vine.string().minLength(8),
    }),
  })
)
