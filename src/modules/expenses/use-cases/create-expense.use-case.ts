import { IResult, Result, GenerateUUID } from 'rich-domain'
import { Expense } from '../entitites/expense.entity'
import { expenseSchema } from '../schemas/expense.schema'

export type TCreateExpenseInput = {
  description: string
  amount: number
  date: Date
  ownerId: string
}

export type TCreateExpenseOutput = IResult<Expense>

export class CreateExpenseUseCase {
  static async execute(
    input: TCreateExpenseInput
  ): Promise<TCreateExpenseOutput> {
    const inputDTO = expenseSchema
      .pick({ description: true, amount: true, date: true, ownerId: true })
      .parse({
        ...input,
      })

    const expenseOrError = Expense.create({ ...inputDTO, id: GenerateUUID() })

    if (expenseOrError.isFail()) return Result.fail(expenseOrError.error())

    return Result.Ok(expenseOrError.value())
  }
}
