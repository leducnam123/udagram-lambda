import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'
import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'


const logger = createLogger('dataLayer')

export class TodosAccess {
  constructor(
    documentClient = AWSXRay.captureAWSv3Client(new DynamoDB()),
    todosTable = process.env.TODOS_TABLE
  ) {
    this.todosTable = todosTable
    this.dynamoDbClient = DynamoDBDocument.from(documentClient)
  }

  async getToDosByUserId(userId) {
    logger.info('Getting todos for user', { userId })
    const params = {
      TableName: this.todosTable,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }

    const result = await this.dynamoDbClient.query(params)
    return result.Items
  }

  async create(createTodoRequest) {
    logger.info(`Creating a TODO with id ${createTodoRequest.todoId} ${JSON.stringify(createTodoRequest, null, 2)}`)

    await this.dynamoDbClient.put({
      TableName: this.todosTable,
      Item: createTodoRequest
    })

    return { ...createTodoRequest }
  }

  async update(userId, todoId, updateTodoRequest = {}) {
    logger.info(`Updating ${todoId} with ${JSON.stringify(updateTodoRequest, null, 2)}`)
    const { name, dueDate, done } = updateTodoRequest
    const params = {
      TableName: this.todosTable,
      Key: {
        userId,
        todoId
      },
      UpdateExpression: 'set #name = :name, dueDate = :dueDate, done = :done',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name,
        ':dueDate': dueDate,
        ':done': done
      },
      ReturnValues: 'UPDATED_NEW'
    }

    await this.dynamoDbClient.update(params)
  }

  async delete(userId, todoId) {
    logger.info('Deleting todo', { userId, todoId })

    const params = {
      TableName: this.todosTable,
      Key: { userId, todoId }
    }

    await this.dynamoDbClient.delete(params)
  }

  async updateAttachedFileUrl(userId, todoId, attachmentUrl) {
    logger.info('Updating attachment URL', { userId, todoId, attachmentUrl })

    const params = {
      TableName: this.todosTable,
      Key: { userId, todoId },
      UpdateExpression: 'set attachmentUrl = :attachmentUrl',
      ExpressionAttributeValues: {
        ':attachmentUrl': attachmentUrl
      },
      ReturnValues: 'UPDATED_NEW'
    }

    await this.dynamoDbClient.update(params)
  }
}
