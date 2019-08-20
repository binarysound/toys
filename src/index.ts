import * as fs from 'fs'

import { APIGatewayEventRequestContext, Handler } from 'aws-lambda'
import * as AWS from 'aws-sdk'

const { IS_OFFLINE, S3_STATIC_BUCKET_NAME } = process.env

export const index: Handler<APIGatewayEventRequestContext> = (_, context) => {
  const s3 = new AWS.S3()
  const scriptUrl = IS_OFFLINE ?
    '/webapp.js' :
    s3.getSignedUrl('getObject', {
      Bucket: S3_STATIC_BUCKET_NAME,
      Expires: 60,
      Key: 'webapp.js',
    })

  const response = {
    body: `
<html>
<head>
  <meta charset="utf-8">
  <title>BINARYSOUND:TOYS</title>
</head>
<body>
  <div id="root"></div>
  <script type="text/javascript" src="${scriptUrl}"></script>
</body>
</html>
`,
    headers: {
      'Content-Type': 'text/html',
    },
    statusCode: 200,
  }

  context.succeed(response)
}

export const webapp: Handler<APIGatewayEventRequestContext> = (_, context) => {
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
