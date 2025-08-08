// app/validators/register.ts
import vine from '@vinejs/vine'
import Database from '@ioc:Adonis/Lucid/Database'

export const registerValidator = vine.compile(
  vine.object({
    email: vine
      .string()
      .email()
      .trim()
      .minLength(6)
      .maxLength(255)
      .refine(async (value) => {
        const exists = await Database.from('users').where('email', value).first()
        return !exists
      }, 'Пользователь с таким email уже существует'),

    password: vine.string().minLength(6).maxLength(180),
  })
)
