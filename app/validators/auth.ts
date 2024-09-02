import vine from '@vinejs/vine'

export const AuthLoginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
  })
)
