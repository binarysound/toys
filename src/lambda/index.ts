import * as fs from 'fs'

import * as AWS from 'aws-sdk'

import { APIGatewayHandler } from '@/types'
import { getDynamoDB, DYNAMODB_TABLE_NAME } from '@/db'

const {
  IS_OFFLINE,
  S3_STATIC_BUCKET_NAME,
} = process.env

export const index: APIGatewayHandler = async () => {
  const s3 = new AWS.S3()
  const scriptUrl = IS_OFFLINE ?
    '/webapp.js' :
    s3.getSignedUrl('getObject', {
      Bucket: S3_STATIC_BUCKET_NAME,
      Expires: 60,
      Key: 'webapp.js',
    })

  const response = {
    body: `<html>
<head>
  <meta charset="utf-8">
  <title>BINARYSOUND:TOYS</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="${scriptUrl}"></script>
</body>
</html>`,
    headers: {
      'Content-Type': 'text/html',
    },
    statusCode: 200,
  }

  return response
}

export const webapp: APIGatewayHandler = (_, context) => {
  if (IS_OFFLINE) {
    fs.readFile('.webpack/service/src/webapp.js', 'utf-8', (__, data) => {
      const response = {
        body: data,
        headers: {
          'Content-Type': 'text/javascript',
        },
        statusCode: 200,
      }

      context.succeed(response)
    })
  } else {
    context.succeed({
      statusCode: 404,
    })
  }
}

export const scanDB: APIGatewayHandler = async () => {
  const dynamoDB = getDynamoDB()

  const result = await dynamoDB.scan({
    TableName: DYNAMODB_TABLE_NAME!,
  }).promise()

  const { error, data } = result.$response

  if (error) {
    throw error
  } else {
    return {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
      statusCode: 200,
    }
  }
}
