import { Request, Response } from 'express'
import { requestHandlerError } from './errors/handle-request.error'
import asyncLocalStorage from '@/utils/async-local-storage'
import { CreateExpenseUseCase } from '@/modules/expenses/use-cases'
import { ExpenseRepository } from '@/modules/expenses/repositories'
import prismaClient from '@/db'

export class CreateExpenseRequestHandler {
  static async handle(req: Request, res: Response): Promise<void> {
    const response = {
      message: 'Despesa criada com sucesso',
      status: 200,
      metadata: {},
    }
    const { description, amount, date } = req.body
    const ownerId = asyncLocalStorage.getStore()?.id ?? ('' as string)
    try {
      const createdExpenseOrError = await CreateExpenseUseCase.execute({
        description,
        amount,
        date,
        ownerId,
      })

      if (createdExpenseOrError.isOk()) {
        const wasPersistedOrError = await new ExpenseRepository(
          prismaClient
        ).persist(createdExpenseOrError.value())

        if (wasPersistedOrError.isOk())
          response.metadata = { ...createdExpenseOrError.value().props }
        else response.metadata = wasPersistedOrError.error()
      } else {
        response.status = 400
        response.message = 'Erro ao criar a despesa'
        response.metadata = createdExpenseOrError.error()
      }
    } catch (error) {
      response.status = 400
      response.message = 'Erro ao criar a despesa'

      response.metadata = { ...requestHandlerError(error) }
    } finally {
      res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
      })
    }
  }
}
