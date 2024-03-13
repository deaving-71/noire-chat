import vine from '@vinejs/vine'

export const registrationValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const user = await db.from('users').where('email', value).first()
        return !user
      }),
    username: vine.string().unique(async (db, value) => {
      const user = await db.from('users').where('username', value).first()
      return !user
    }),
    password: vine.string().minLength(8).maxLength(32).confirmed({
      confirmationField: 'confirm_password',
    }),
  })
)

export const loginValidator = vine.compile(
  vine
    .object({
      email: vine.string().email(),
      password: vine.string(),
      remember: vine.boolean(),
    })
    .bail(true)
)
