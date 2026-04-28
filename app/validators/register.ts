import vine from '@vinejs/vine'

export const registerValidator = vine.compile(
  vine.object({
    email: vine.string().email().trim().minLength(6).maxLength(255),
    password: vine.string().minLength(6).maxLength(180),
  })
)
