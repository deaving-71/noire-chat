import vine from '@vinejs/vine'

export const channelCreationValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      const channel = await db.from('channels').where('name', value).first()
      return !channel
    }),
  })
)

export const channelShowValidator = vine.compile(
  vine.object({
    params: vine.object({
      slug: vine.string().minLength(8),
    }),
  })
)

export const channelMessageValidator = vine.compile(
  vine.object({
    slug: vine.string().minLength(8),
    content: vine.string(),
  })
)
