import { IResult, Result } from 'rich-domain'

interface Props {
  id: string
  description: string
  amount: number
  date: Date
  ownerId: string
}

const MINIMUM_AMOUNT = 0
const MINIMUM_DESCRIPTION_LENGTH = 3
const MAXIMUM_DESCRIPTION_LENGTH = 191

export class Expense {
  protected constructor(public readonly props: Props) {}
  static create(props: Props): IResult<Expense> {
    const isValid = Expense.validate(props)
    if (isValid.isFail()) return Result.fail(isValid.error())

    const expense = new Expense(props)

    return Result.Ok(expense)
  }

  static validate(props: Props): IResult<void> {
    const messagesError: Array<string> = []
    const isValidAmount = props.amount > MINIMUM_AMOUNT
    const isValidDescription =
      props.description.length >= MINIMUM_DESCRIPTION_LENGTH &&
      props.description.length <= MAXIMUM_DESCRIPTION_LENGTH
    const isValidDate = props.date.getTime() <= Date.now()

    const isValid = isValidAmount && isValidDescription && isValidDate

    if (!isValidAmount)
      messagesError.push(
        `O valor mínimo permitido é ${props.amount.toLocaleString('pt-BR', {
          currency: 'BRL',
          style: 'currency',
        })}`
      )

    if (!isValidDescription)
      messagesError.push(
        `O campo descrição precisa de no mínimo ${MINIMUM_DESCRIPTION_LENGTH} e no máximo ${MAXIMUM_DESCRIPTION_LENGTH} caracteres`
      )

    if (!isValidDate)
      messagesError.push(
        `O campo data precisa ser no máximo ${props.date.toLocaleDateString(
          'pt-BR'
        )}`
      )

    if (isValid) return Result.Ok()
    else return Result.fail(messagesError.join('\n'))
  }
}
