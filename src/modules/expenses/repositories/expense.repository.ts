import { PrismaClient } from '@prisma/client'
import { IResult, Result } from 'rich-domain'
import { Expense } from '@/modules/expenses/entitites/expense.entity'

interface IExpenseRepository {
  persist(expense: Expense): Promise<IResult<void>>
  getAll(ownerId: string): Promise<IResult<Array<Expense>>>
  getById(id: string, ownerId: string): Promise<IResult<Expense>>
  delete(expense: Expense): Promise<IResult<void>>
}

export class ExpenseRepository implements IExpenseRepository {
  constructor(private readonly prismaClient: PrismaClient) {}
  async persist(expense: Expense): Promise<IResult<void>> {
    const { id, description, amount, date, ownerId } = expense.props

    const persistedExpense = await this.prismaClient.expense.upsert({
      create: { id, description, amount, date, ownerId },
      update: { description, amount, date },
      where: { id, AND: { ownerId } },
    })

    if (persistedExpense) return Result.Ok()
    else return Result.fail('Falha ao persistir a despesa')
  }
  async getAll(ownerId: string): Promise<IResult<Array<Expense>>> {
    const findedExpense = await this.prismaClient.expense.findMany({
      where: { ownerId },
    })

    const listOfExpenses = findedExpense.map(Expense.create)

    const combinedExpensesOrError = Result.combine(listOfExpenses)

    if (combinedExpensesOrError.isOk())
      return Result.Ok(listOfExpenses.map((expense) => expense.value()))
    else return Result.fail('Falha ao buscar as despesas')
  }
  async getById(id: string, ownerId: string): Promise<IResult<Expense>> {
    const findedExpense = await this.prismaClient.expense.findUnique({
      where: { id, ownerId },
    })

    if (!findedExpense) return Result.fail()

    const expenseOrError = Expense.create(findedExpense)

    if (expenseOrError.isOk()) return Result.Ok(expenseOrError.value())
    else return Result.fail()
  }
  async delete(expense: Expense): Promise<IResult<void>> {
    const { id, ownerId } = expense.props
    const deletedExpense = await this.prismaClient.expense.delete({
      where: { id, AND: { ownerId } },
    })

    if (deletedExpense) return Result.Ok()
    else return Result.Ok()
  }
}
