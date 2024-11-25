import middy from '@middy/core';
import cors from '@middy/http-cors';
import httpErrorHandler from '@middy/http-error-handler';
import { getUserId } from '../utils.mjs';
import { createTodo } from '../../businessLogic/todos.mjs';
import * as logger from 'winston'

export const handler = middy()
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true,
    })
  )
  .handler(async (event) => {
    logger.info(`Processing createTodo event ${JSON.stringify(event, null, 2)}`)
    const newTodo = JSON.parse(event.body)

    const userId = getUserId(event);

    const item = await createTodo(newTodo, userId);

    logger.info(`Item created ${JSON.stringify(item, null, 2)}`);

    return {
      statusCode: 201,
      body: JSON.stringify({
        item
      }),
    };
  });
