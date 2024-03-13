import vine from '@vinejs/vine'

export const channelCreationValidator = vine.compile(
  vine.object({
    name: vine.string().unique(async (db, value) => {
      const channel = await db.from('channels').where('name', value).first()
      return !channel
    }),
  })
)
