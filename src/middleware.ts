import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import asyncLocalStorage from '@/utils/async-local-storage'

type JWTPayload = { id: string }

export async function JWTMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const jwtToken = req.headers['authorization'] ?? ''

  jwt.verify(jwtToken, String(process.env.JWT_PRIVATE_KEY), (error, info) => {
    if (error || !info || typeof info === 'string') {
      res.status(403).end()
      return
    }

    asyncLocalStorage.run(info as JWTPayload, () => next())
  })
}
