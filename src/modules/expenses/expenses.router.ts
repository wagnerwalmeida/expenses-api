import { Router } from 'express'

import { JWTMiddleware } from '../../middleware'
import {
  GetAllExpensesRequestHandler,
  GetExpenseByIdRequestHandler,
  CreateExpenseRequestHandler,
  DeleteExpenseByIdRequestHandler,
  UpdateExpenseByIdRequestHandler,
} from './request-handlers'

const expensesRoutes = Router()

expensesRoutes.use('/expenses', JWTMiddleware)

expensesRoutes.get('/expenses', GetAllExpensesRequestHandler.handle)
expensesRoutes.post('/expenses', CreateExpenseRequestHandler.handle)
expensesRoutes.get('/expenses/:id', GetExpenseByIdRequestHandler.handle)
expensesRoutes.put('/expenses/:id', UpdateExpenseByIdRequestHandler.handle)
expensesRoutes.delete('/expenses/:id', DeleteExpenseByIdRequestHandler.handle)

export { expensesRoutes }
