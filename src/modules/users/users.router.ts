import { Router, Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import { ZodError, z } from 'zod'
import prismaClient from '../../db'
import { handleOneLevelZodError } from '../../utils/zod-error'
import { encryptPassword, comparePassword } from '../../utils/crypt'

const usersRoutes = Router()

const userSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string(),
})

usersRoutes.get('/login', async (req: Request, res: Response) => {
  const { password } = req.body
  res.send(await encryptPassword(password))
})

usersRoutes.post('/login', async (req: Request, res: Response) => {
  const response = { message: '', status: 200, metadata: {} }

  const { email, password } = req.body
  try {
    const loginDTO = userSchema
      .pick({ email: true, password: true })
      .parse({ email, password })

    const findedUser = await prismaClient.user.findUnique({
      where: { email: loginDTO.email },
    })

    if (findedUser) {
      const { password, ...userData } = findedUser

      const isSamePassword = await comparePassword(loginDTO.password, password)

      if (isSamePassword) {
        const token = jwt.sign(userData, String(process.env.JWT_PRIVATE_KEY), {
          expiresIn: '1d',
        })

        response.message = 'Usuário logado com sucesso'
        response.metadata = { token }
      } else {
        response.status = 400
        response.message = 'Não foi possível logar com esse e-mail e senha'
      }
    } else {
      response.status = 400
      response.message = `Nenhum usuário encontrado com o E-mail: ${email}`
    }
  } catch (error) {
    response.status = 400
    response.message = 'Erro ao tentar logar'

    if (error instanceof ZodError)
      response.metadata = { error: handleOneLevelZodError(error) }
    else response.metadata = { error }
  }

  res.status(response.status).json({
    message: response.message,
    metadata: response.metadata,
  })
})

export { usersRoutes }
