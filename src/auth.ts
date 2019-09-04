import * as jwt from 'jsonwebtoken'

import { getDynamoDB, DYNAMODB_TABLE_NAME } from '@/db'

const privateKey = process.env.API_PRIVATE_KEY || ''
const algorithm = 'HS256'

export async function jwtSign(userId: string) {
  return await jwt.sign(
    { userId },
    privateKey,
    {
      algorithm,
    }
  )
}

export async function jwtVerify(token: string) {
  return await jwt.verify(token, privateKey, {
    algorithms: [algorithm],
  })
}

export async function getUserInfo(userId: string) {
  const db = getDynamoDB()
  const user = await db.getItem({
    TableName: DYNAMODB_TABLE_NAME!,
    Key: {
      pk: {
        S: `user_${userId}`,
      },
    },
  }).promise()

  return user.Item
}
