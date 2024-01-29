import { Request, Response } from 'express'
import { requestHandlerError } from './errors/handle-request.error'
import asyncLocalStorage from '@/utils/async-local-storage'
import { DeleteExpenseByIdUseCase } from '@/modules/expenses/use-cases'

export class DeleteExpenseByIdRequestHandler {
  static async handle(req: Request, res: Response): Promise<void> {
    const response = {
      message: 'Despesa encontrada com sucesso',
      status: 200,
      metadata: {},
    }
    const { id } = req.params
    const ownerId = asyncLocalStorage.getStore()?.id ?? ('' as string)
    try {
      const deletedExpense = await DeleteExpenseByIdUseCase.execute({
        id,
        ownerId,
      })

      if (deletedExpense.isOk()) {
        response.message = 'Despesa deletada com sucesso'
        response.metadata = { ...deletedExpense.value().props }
      } else {
        response.status = 400
        response.message = `Nenhuma despesa encontrada com o ID: ${id}`
      }
    } catch (error) {
      response.status = 400
      response.message = 'Erro ao deletar a despesa pelo id'

      response.metadata = { ...requestHandlerError(error) }
    } finally {
      res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
      })
    }
  }
}
