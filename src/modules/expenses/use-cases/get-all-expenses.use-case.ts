import { IResult, Result, GenerateUUID } from 'rich-domain'
import { Expense } from '../entitites/expense.entity'
import { expenseSchema } from '../schemas/expense.schema'
import { ExpenseRepository } from '../repositories'
import prismaClient from '@/db'

export type TGetAllExpensesInput = {
  ownerId: string
}

export type TGetAllExpensesOutput = IResult<Array<Expense>>

export class GetAllExpensesUseCase {
  static async execute(
    input: TGetAllExpensesInput
  ): Promise<TGetAllExpensesOutput> {
    const inputDTO = expenseSchema.pick({ ownerId: true }).parse({
      ...input,
    })

    const findedExpensesOrError = await new ExpenseRepository(
      prismaClient
    ).getAll(inputDTO.ownerId)

    if (findedExpensesOrError.isFail())
      return Result.fail(findedExpensesOrError.error())

    return Result.Ok(findedExpensesOrError.value())
  }
}
