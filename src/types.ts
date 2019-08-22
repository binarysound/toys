import { Handler, APIGatewayProxyEvent } from 'aws-lambda'

export type APIGatewayHandler = Handler<APIGatewayProxyEvent>
