import { IResult, Result, GenerateUUID } from 'rich-domain'
import { Expense } from '../entitites/expense.entity'
import { expenseSchema } from '../schemas/expense.schema'
import { ExpenseRepository } from '../repositories'
import prismaClient from '@/db'

export type TUpdateExpenseByIdInput = {
  id: string
  ownerId: string

  description?: string
  amount?: number
  date?: Date
}

export type TUpdateExpenseByIdOutput = IResult<void>

export class UpdateExpenseByIdUseCase {
  static async execute({
    id,
    ownerId,
    description,
    amount,
    date,
  }: TUpdateExpenseByIdInput): Promise<TUpdateExpenseByIdOutput> {
    const inputDTO = expenseSchema.pick({ id: true, ownerId: true }).parse({
      id,
      ownerId,
    })

    const updateExpenseDTO = expenseSchema
      .pick({ description: true, amount: true, date: true })
      .partial()
      .refine(
        ({ description, amount, date }) =>
          description !== undefined ||
          amount !== undefined ||
          date !== undefined,
        {
          message:
            'Ao menos um dos seguintes campos são obrigatórios: description, amount ou date',
        }
      )
      .parse({ description, amount, date })

    const expenseRepository = new ExpenseRepository(prismaClient)

    const findedExpenseOrError = await expenseRepository.getById(
      inputDTO.id,
      inputDTO.ownerId
    )

    if (findedExpenseOrError.isFail())
      return Result.fail(findedExpenseOrError.error())

    const findedExpense = findedExpenseOrError.value().props

    const expenseDTO = {
      id: inputDTO.id,
      ownerId: inputDTO.ownerId,
      description: updateExpenseDTO.description ?? findedExpense.description,
      amount: updateExpenseDTO.amount ?? findedExpense.amount,
      date: updateExpenseDTO.date ?? findedExpense.date,
    }

    const expenseOrError = Expense.create(expenseDTO)

    if (expenseOrError.isFail()) return Result.fail(expenseOrError.error())

    const persistedExpenseOrError = await expenseRepository.persist(
      expenseOrError.value()
    )

    if (persistedExpenseOrError.isFail())
      return Result.fail(persistedExpenseOrError.error())

    return Result.Ok()
  }
}
