import { Request, Response } from 'express'
import { requestHandlerError } from './errors/handle-request.error'
import asyncLocalStorage from '@/utils/async-local-storage'
import { GetExpenseByIdUseCase } from '@/modules/expenses/use-cases'

export class GetExpenseByIdRequestHandler {
  static async handle(req: Request, res: Response): Promise<void> {
    const response = {
      message: 'Despesa encontrada com sucesso',
      status: 200,
      metadata: {},
    }
    const { id } = req.params
    const ownerId = asyncLocalStorage.getStore()?.id ?? ('' as string)
    try {
      const findedExpense = await GetExpenseByIdUseCase.execute({
        id,
        ownerId,
      })

      if (findedExpense.isOk()) {
        response.message = 'Despesa encontrada com sucesso'
        response.metadata = { ...findedExpense.value().props }
      } else {
        response.status = 400
        response.message = `Nenhuma despesa encontrada com o ID: ${id}`
      }
    } catch (error) {
      response.status = 400
      response.message = 'Erro ao encontrar a despesa pelo id'

      response.metadata = { ...requestHandlerError(error) }
    } finally {
      res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
      })
    }
  }
}
