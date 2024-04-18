/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type FastifyRequest, type FastifyReply, fastify } from 'fastify'
import jwt, { type Secret } from 'jsonwebtoken'
import { type Knex } from 'knex'
import {
  type User,
  createSendToken,
  decryptPassword,
  encryptPassword
} from '../config/auth'
import knex from '../config/knex'
import { withTransaction } from '../config/transact'
import {
  createUser,
  findUserByEmail,
  getUserById
} from '../model/user.model'
import Email from '../utils/email'
import { CustomError, NotFoundError, UnauthorizedError } from '@/core/errors'

const server = fastify()
server.decorateReply('user', null)

interface MyRequestBody {
  email: string
  username: string
  password: string
  role: string
}

export const signup = async (
  req: FastifyRequest<{ Body: MyRequestBody }>,
  res: FastifyReply
): Promise<any> => {
  const url = `${req.protocol}://${req.headers.host}/me`

  const { email, username, password, role } = req.body

  const isUserExist = await findUserByEmail(String(email))

  if (isUserExist.length > 0) {
    throw new NotFoundError('User already exist')
  }
  const passEncrypt = await encryptPassword(String(password))

  await withTransaction(
    knex,
    async (trx: Knex) =>
      await createUser(
        { email, username, password: passEncrypt, role },
        trx
      )
  )
    .then(async (result: User[]) => {
      createSendToken(result[0], 201, req, res)
      await Email(result[0], url).sendWelcome()
    })
    .catch((err: string) => {
      throw new Error(err)
    })
}

export const login = async (
  req: FastifyRequest<{ Body: { email: string, password: string } }>,
  res: FastifyReply
): Promise<any> => {
  const { email, password } = req.body

  // 1) Check if email and password exist
  if (!email ?? !password) {
    throw new CustomError('Please provide email and password!', '', 400)
  }

  await findUserByEmail(String(email)).then(async (result: any) => {
    if (result.length === 0) {
      throw new CustomError('User not found', '', 404)
    } else {
      const isPasswordCorrect = await decryptPassword(
        String(password),
        String(result[0].password)
      )

      if (!isPasswordCorrect) {
        throw new CustomError('Incorrect email or password', '', 401)
      }

      createSendToken(result[0] as User, 200, req, res)
    }
  })
}

export const protect = async (
  req: any,
  res: any
): Promise<any> => {
  let token: string | undefined
  if (
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }
  if (req.headers?.['x-api-key'] !== process.env.X_API_KEY) {
    throw new UnauthorizedError('Invalid token. Please log in again.')
  }
  if (!token) {
    throw new UnauthorizedError('You are not logged in! Please log in to get access.')
  }

  // 2) Verification token
  let decoded: any
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET as Secret)
  } catch (err) {
    throw new UnauthorizedError('Invalid token. Please log in again.')
  }

  // 3) Check if user still exists
  const currentUser = await getUserById(String(decoded?.id), knex)
  if (!currentUser) {
    throw new UnauthorizedError('Invalid token. Please log in again.')
  }
  /* to be implemented later */
  // 4) Check if user changed password after the token was issued
  //   if (currentUser.changedPasswordAfter(decoded.iat)) {
  //     next(
  //       new AppError('User recently changed password! Please log in again.', 401)
  //     )
  //     return
  //   }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
}

export const restrictTo = (...roles: string[]) => {
  return async (req: any, res: any) => {
    try {
      const { id = '' } = res.user

      if (!roles.includes(String(res.locals?.user?.role))) {
        throw new UnauthorizedError('You do not have permission to perform this action')
      }

      // Check if user still exists
      const findRole = await getUserById(String(id), knex)

      if (!findRole || findRole.role !== 'Admin') {
        throw new UnauthorizedError('You do not have permission to perform this action')
      }
    } catch (error) {
      // Handle the error here
      console.error(error)
      throw error
    }
  }
}
