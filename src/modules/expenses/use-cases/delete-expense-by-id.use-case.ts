import { IResult, Result, GenerateUUID } from 'rich-domain'
import { Expense } from '../entitites/expense.entity'
import { expenseSchema } from '../schemas/expense.schema'
import { ExpenseRepository } from '../repositories'
import prismaClient from '@/db'

export type TDeleteExpenseByIdInput = {
  id: string
  ownerId: string
}

export type TDeleteExpenseByIdOutput = IResult<Expense>

export class DeleteExpenseByIdUseCase {
  static async execute(
    input: TDeleteExpenseByIdInput
  ): Promise<TDeleteExpenseByIdOutput> {
    const inputDTO = expenseSchema.pick({ id: true, ownerId: true }).parse({
      ...input,
    })

    const expenseRepository = new ExpenseRepository(prismaClient)

    const findedExpenseOrError = await expenseRepository.getById(
      inputDTO.id,
      inputDTO.ownerId
    )

    if (findedExpenseOrError.isFail())
      return Result.fail(findedExpenseOrError.error())

    const deletedExpenseOrError = await expenseRepository.delete(
      findedExpenseOrError.value()
    )

    if (deletedExpenseOrError.isFail())
      return Result.fail(deletedExpenseOrError.error())

    return Result.Ok(findedExpenseOrError.value())
  }
}
