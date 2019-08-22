import { Handler, APIGatewayProxyEvent } from 'aws-lambda'

interface APIRequest<Body> {
  body?: Body
  rawBody: any
  path: string
  pathParameters?: {[key: string]: string}
  queryStringParameters?: {[key: string]: string}
}

interface APIResult {
  json?: any
  error?: {
    statusCode: number
    body?: string
  }
}

interface HandlerOptions<RequestBody> {
  handler(request: APIRequest<RequestBody>): Promise<APIResult>
}

function getParsedJSONOrUndefined(data: any): any {
  if (typeof data === 'string') {
    try {
      return JSON.parse(data)
    } catch {
    }
  }
  return undefined
}

function isJSONRequest(event: APIGatewayProxyEvent): boolean {
  const headers = Object.keys(event.headers)
  const headerKey = headers.find(header => {
    return header.toLowerCase() === 'content-type'
  })

  if (headerKey) {
    return event.headers[headerKey] === 'application/json'
  }
  return false
}

export function createHandler<RequestBody = undefined>({
  handler,
}: HandlerOptions<RequestBody>): Handler<APIGatewayProxyEvent> {
  return async event => {
    const parsedBody = isJSONRequest(event) ? getParsedJSONOrUndefined(event.body) : undefined
    const result = await handler({
      body: parsedBody,
      rawBody: event.body,
      path: event.path,
      pathParameters: event.pathParameters || undefined,
      queryStringParameters: event.queryStringParameters || undefined,
    })

    if (result.error) {
      const { statusCode, body } = result.error

      return {
        statusCode,
        body,
      }
    }

    if (result.json) {
      return {
        body: JSON.stringify(result.json),
        headers: {
          'Content-Type': 'application/json',
        },
        statusCode: 200,
      }
    }

    return {
      statusCode: 200,
    }
  }
}
