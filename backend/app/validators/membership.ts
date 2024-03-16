import vine from '@vinejs/vine'

export const updateMembershipValidator = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().minLength(8),
    }),
  })
)
