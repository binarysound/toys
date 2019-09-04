import * as Joi from '@hapi/joi'

import { createHandler } from '@/api'
import { jwtSign } from '@/auth'
import { getDynamoDB } from '@/db'

interface RegisterRequest {
  userId: string
  password: string
}

export const register = createHandler<RegisterRequest>({
  async handler() {
    const registerRequestSchema = Joi.object().keys({
      userId: Joi.string().required(),
      password: Joi.string().required(),
    })
    const db = getDynamoDB()
    db.getItem({

    })

    return {}
  }
})

export const login = createHandler({
  async handler() {
    const token = await jwtSign('hello')

    return {
      json: {
        token,
      }
    }
  }
})
