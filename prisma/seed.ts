import { prismaClient } from '@/db'
;(async () => {
  await prismaClient.expense.deleteMany()
  await prismaClient.user.deleteMany()

  await prismaClient.user.create({
    data: {
      name: 'Wagner',
      email: 'mail@mail.com',
      password: '12345',
      expenses: {
        create: [
          {
            description: 'Aluguel',
            amount: 1_000,
            date: new Date(),
          },
          {
            description: 'Supermercado',
            amount: 500,
            date: new Date(),
          },
        ],
      },
    },
  })
})()
