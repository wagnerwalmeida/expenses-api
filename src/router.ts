import { Router } from 'express'
import { expensesRoutes } from './modules/expenses/expenses.router'
import { usersRoutes } from './modules/users/users.router'

const routes: Array<Router> = [expensesRoutes, usersRoutes]

const router = Router()

router.use(...routes)

export { router }
