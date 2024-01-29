import { IResult, Result, GenerateUUID } from 'rich-domain'
import { Expense } from '../entitites/expense.entity'
import { expenseSchema } from '../schemas/expense.schema'
import { ExpenseRepository } from '../repositories'
import prismaClient from '@/db'

export type TGetExpenseByIdInput = {
  id: string
  ownerId: string
}

export type TGetExpenseByIdOutput = IResult<Expense>

export class GetExpenseByIdUseCase {
  static async execute(
    input: TGetExpenseByIdInput
  ): Promise<TGetExpenseByIdOutput> {
    const inputDTO = expenseSchema.pick({ id: true, ownerId: true }).parse({
      ...input,
    })

    const findedExpenseOrError = await new ExpenseRepository(
      prismaClient
    ).getById(inputDTO.id, inputDTO.ownerId)

    if (findedExpenseOrError.isFail())
      return Result.fail(findedExpenseOrError.error())

    return Result.Ok(findedExpenseOrError.value())
  }
}
