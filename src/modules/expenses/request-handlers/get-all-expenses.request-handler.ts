import { Request, Response } from 'express'
import { requestHandlerError } from './errors/handle-request.error'
import asyncLocalStorage from '@/utils/async-local-storage'
import { GetAllExpensesUseCase } from '@/modules/expenses/use-cases'

export class GetAllExpensesRequestHandler {
  static async handle(req: Request, res: Response): Promise<void> {
    const response = {
      message: 'Despesa encontrada com sucesso',
      status: 200,
      metadata: {},
    }

    const ownerId = asyncLocalStorage.getStore()?.id ?? ('' as string)
    try {
      const findedExpenses = await GetAllExpensesUseCase.execute({
        ownerId,
      })

      if (findedExpenses.isOk()) {
        response.message = 'Lista de despesas encontrada com sucesso'

        const expenses = findedExpenses.value()
        response.metadata = expenses.map((expense) => ({ ...expense.props }))
      } else {
        response.status = 400
        response.message = `Nenhuma despesa encontrada`
      }
    } catch (error) {
      response.status = 400
      response.message = 'Erro ao buscar a lista de despesas'

      response.metadata = { ...requestHandlerError(error) }
    } finally {
      res.status(response.status).json({
        message: response.message,
        metadata: response.metadata,
      })
    }
  }
}
