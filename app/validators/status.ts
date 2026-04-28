import vine from '@vinejs/vine'

export const statusValidator = vine.compile(
  vine.object({
    status: vine.enum(['active', 'inactive'] as const),
  })
)
