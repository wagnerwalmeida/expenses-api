import { Request, Response } from 'express'
import { requestHandlerError } from './errors/handle-request.error'
import asyncLocalStorage from '@/utils/async-local-storage'
import { UpdateExpenseByIdUseCase } from '@/modules/expenses/use-cases'
import { ExpenseRepository } from '@/modules/expenses/repositories'
import prismaClient from '@/db'

export class UpdateExpenseByIdRequestHandler {
  static async handle(req: Request, res: Response): Promise<void> {
    const response = {
      message: 'Despesa criada com sucesso',
      status: 200,
      metadata: {},
    }
    const { id } = req.params
    const { description, amount, date } = req.body
    const ownerId = asyncLocalStorage.getStore()?.id ?? ('' as string)
    try {
      const updatedExpenseOrError = await UpdateExpenseByIdUseCase.execute({
        id,
        description,
        amount,
        date,
        ownerId,
      })

      if (updatedExpenseOrError.isOk()) {
        response.message = 'Despesa atualizada com sucesso'
      } else {
        response.status = 400
        response.message = `Erro ao atualizar a despesa`
        response.metadata = updatedExpenseOrError.error()
      }
    } catch (error) {
      response.status = 400
      response.message = 'Erro ao atualizar a despesa'

      response.metadata = { ...requestHandlerError(error) }
    } finally {
      res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
      })
    }
  }
}
