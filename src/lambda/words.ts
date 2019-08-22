import * as Joi from '@hapi/joi'

import { createHandler } from '@/api'
import { getDynamoDB, DYNAMODB_TABLE_NAME } from '@/db'

interface CreateWordReqeust {
  wordlistId: string
  word: string
  desc: string
}

export const createWord = createHandler<CreateWordReqeust>({
  async handler(request) {
    const createWordRequestSchema = Joi.object().keys({
      wordlistId: Joi.string().required(),
      word: Joi.string().required(),
      desc: Joi.string().required(),
    })

    const validationResult = createWordRequestSchema.validate(request.body)

    if (validationResult.error) {
      return {
        error: {
          statusCode: 400,
          body: '',
        }
      }
    }

    const requestBody: CreateWordReqeust = request.body!

    const db = getDynamoDB()
    const result = await db.putItem({
      TableName: DYNAMODB_TABLE_NAME!,
      Item: {
        pk: {
          S: `wordlist_${requestBody.wordlistId}_words`,
        },
        sk: {
          S: (new Date()).toISOString(),
        },
        word: {
          S: requestBody.word,
        },
        desc: {
          S: requestBody.desc,
        },
      },
    }).promise()

    const { error, data } = result.$response

    if (error) {
      throw error
    }

    return {
      json: data,
    }
  }
})

export const getWords = createHandler({
  async handler(request) {
    const { queryStringParameters } = request

    if (!queryStringParameters || !('wordlistId' in queryStringParameters)) {
      return {
        error: {
          statusCode: 400,
          body: 'Query parameter `wordlistId` is missing.',
        }
      }
    }

    const { wordlistId } = queryStringParameters

    const db = getDynamoDB()
    const result = await db.query({
      TableName: DYNAMODB_TABLE_NAME!,
      KeyConditionExpression: '#pk = :wordlistId',
      ExpressionAttributeNames: {
        '#pk': 'pk',
      },
      ExpressionAttributeValues: {
        ':wordlistId': {
          S: `wordlist_${wordlistId}_words`,
        },
      },
      ScanIndexForward: false,
    }).promise()

    if (result.Items) {
      const items = result.Items.map(item => {
        return {
          word: item.word.S,
          desc: item.desc.S,
        }
      })

      return {
        json: items,
      }
    }

    throw result.$response.error
  }
})
