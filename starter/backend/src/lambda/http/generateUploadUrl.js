import middy from '@middy/core'
import cors from '@middy/http-cors'
import httpErrorHandler from '@middy/http-error-handler'
import { getUserId } from '../utils.mjs'
import { loggers } from 'winston'
import { generateAttachmentUrl, getFormattedUrl } from '../../fileStorage/attachmentUtils.mjs'

export const handler = middy()
  .use(httpErrorHandler())
  .use(cors({
    credentials: true
  }))
  .handler(async (event) => {
    const todoId = event.pathParameters.todoId;
    loggers.info(`Uploading attachment for ${todoId}`)

    const image = JSON.parse(event.body)
    const userId = getUserId(event);

    const attachmentUrl = getFormattedUrl(todoId)
    const uploadUrl = await generateAttachmentUrl(todoId)

    await updateAttachedFileUrl(userId, todoId, image, attachmentUrl)

    return {
      statusCode: 201, body: JSON.stringify({
        uploadUrl
      })
    }
  })
