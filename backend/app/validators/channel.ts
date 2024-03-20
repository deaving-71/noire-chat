import vine, { SimpleMessagesProvider } from '@vinejs/vine'

export const channelCreationValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .minLength(2)
      .unique(async (db, value) => {
        const channel = await db.from('channels').where('name', value).first()
        return !channel
      }),
  })
)

channelCreationValidator.messagesProvider = new SimpleMessagesProvider({
  'name.minLength': 'Channel name must be at least 2 characters',
})

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
