import { z } from 'zod'

const expenseSchema = z.object({
  id: z.string(),
  description: z.string(), //.min(3).max(191),
  amount: z.number(), //.positive(),
  date: z.coerce.date(), //.max(new Date()),
  ownerId: z.string(),
})

export { expenseSchema }
