/* eslint-disable @typescript-eslint/no-misused-promises */
import { type FastifyPluginAsync, type FastifyInstance } from 'fastify'
import { login, protect, restrictTo, signup } from '../controller/auth.controller'
import { validateRequest } from '../middleware/validate'
import {
  getUser,
  findUserById,
  createUser,
  updateUser,
  deleteUser
} from '../controller/user.controller'
import { userSchema } from '../utils/validator'

const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  /* Auth routes */
  fastify.post('/sign-up', {}, signup)
  fastify.post('/login', {}, login)

  fastify.decorateRequest('user', 'hello world')

  /* Protect all routes after this middleware */
  // fastify.addHook('preHandler', protect)
  fastify.addHook('preHandler', restrictTo('Admin'))

  /* User routes */
  fastify.get('/', getUser)
  // fastify.get('/:id', {}, findUserById)
  // fastify.post('/', { preValidation: [validateRequest(userSchema)] }, createUser)
  // fastify.put('/:id', { preValidation: [validateRequest(userSchema)] }, updateUser)
  // fastify.delete('/:id', {}, deleteUser)
}

export default userRoutes
