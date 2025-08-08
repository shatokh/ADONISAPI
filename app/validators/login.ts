// app/validators/login.ts
import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim(),
    password: vine.string().minLength(6),
  })
)

// app/validators/status.ts
import vine from '@vinejs/vine'

export const statusValidator = vine.compile(
  vine.object({
    status: vine.enum(['active', 'inactive'] as const),
  })
)
