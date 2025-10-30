import vine from '@vinejs/vine'

export const AuthLoginValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
    password: vine.string().trim(),
    rememberMe: vine.boolean().optional(),
  })
)

export const AuthRegisterValidator = vine.compile(
  vine.object({
    username: vine.string().trim().minLength(3).maxLength(50),
    email: vine.string().trim().email(),
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  })
)

export const PasswordResetRequestValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)

export const PasswordResetValidator = vine.compile(
  vine.object({
    password: vine
      .string()
      .minLength(8)
      .confirmed()
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/),
  })
)

export const ResendVerificationValidator = vine.compile(
  vine.object({
    email: vine.string().trim().email(),
  })
)
