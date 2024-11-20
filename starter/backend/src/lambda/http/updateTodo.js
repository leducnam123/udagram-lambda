import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { updateTodo } from '../../businessLogic/todos.mjs'
import { loggers } from 'winston'

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const updateRequest = JSON.parse(event.body)
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    loggers.info(`Processing updateTodo ${JSON.stringify(updateRequest, null, 2)}, id: ${todoId}`)


    await updateTodo(userId, todoId, updateRequest)

    return {
      statusCode: 204
    }
  })
