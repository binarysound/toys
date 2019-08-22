import * as AWS from 'aws-sdk'

const {
  IS_OFFLINE,
  LOCAL_DYNAMODB_PORT,
  REGION,
  DYNAMODB_TABLE_NAME,
} = process.env

export function getDynamoDB() {
  return new AWS.DynamoDB({
    region: IS_OFFLINE ? 'localhost' : REGION,
    ...(IS_OFFLINE ? {
      endpoint: `http://localhost:${LOCAL_DYNAMODB_PORT}`,
      accessKeyId: 'DEFAULT_ACCESS_KEY',
      secretAccessKey: 'DEFAULT_SECRET',
    } : undefined),
  })
}

export { DYNAMODB_TABLE_NAME }
