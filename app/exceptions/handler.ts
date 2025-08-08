import Logger from '@ioc:Adonis/Core/Logger'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'

export default class ExceptionHandler {
  public async handle(error: Exception, { response }: HttpContextContract) {
    // Если это наша ошибка (4xx), отдаём её как есть
    if (error.status && error.status < 500) {
      return response.status(error.status).send({ message: error.message })
    }

    // Логируем внутреннюю ошибку
    Logger.error(error.stack || error.message)

    // Все прочие (500+) конвертим в 400 Bad Request
    return response.status(400).send({
      message: 'Не удалось обработать запрос, проверьте ввод и повторите.',
    })
  }
}
