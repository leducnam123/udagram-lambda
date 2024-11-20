import * as uuid from 'uuid'
import { TodosAccess } from '../dataLayer/todosAccess.mjs'
import * as logger from 'winston'

const todosAccess = new TodosAccess()

export const getTodosByUserId = async (userId) => {
  logger.info(`getToDosByUserId ${userId}`)
  return todosAccess.getToDosByUserId(userId)
}

export const createTodo = async (userId, todoData) => {
  const todoId = uuid.v4()
  const newTodo = {
    userId,
    todoId,
    createdAt: new Date().toISOString(),
    done: false,
    ...todoData
  }
  return todosAccess.create(newTodo)
}

export const updateTodo = async (userId, todoId, todoData) => {
  logger.info(`updateTodo ${userId} todoId ${todoId} request ${JSON.stringify(updateTodoRequest, null, 2)}`)
  return await todosAccess.update(userId, todoId, todoData)
}

export async const deleteTodo = async (userId, todoId) => {
  logger.info(`createTodo ${userId} todoId ${todoId}`)
  return todosAccess.delete(userId, todoId)
}

export const updateAttachedFileUrl = async (userId, todoId, image, attachmentUrl) => {
  logger.info(`setAttachmentUrl ${userId} todoId ${todoId} attachmentUrl ${attachmentUrl}`)
  return await todosAccess.updateAttachedFileUrl(userId, todoId, image, attachmentUrl)
}

