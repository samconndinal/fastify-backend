/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import { type FastifyReply, type FastifyRequest } from 'fastify'
// import knex from '../config/knex'
// import { InternalServerError, NotFoundError } from '@/core/lib/errors'
// import { getUserByIdModel } from '../model/user.model'
import {
  // create as createUserService,
  // destroy as deleteUserService,
  search as getUserService
  // update as updateUserService
} from '../service/user.service'

export const getUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const { page = 1, limit = 10 } = request.query as any

  await getUserService(Number(page), Number(limit))
    .then(async (result) => await reply.code(200).send({ data: result }))
    .catch((err: string) => { throw new Error(err) })
}

export const findUserById = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> => {
  const { id } = request.params as any

  // await getUserByIdModel(id, knex)
  //   .then((result: any) => {
  //     if (!result) {
  //       throw new NotFoundError('User not found')
  //     }
  //     return reply.code(200).send({ data: result })
  //   })
  //   .catch((err: string) => { throw new NotFoundError(err) })
}

export const createUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  // await createUserService(request.body as any)
  // .then((result) => reply.code(200).send({ data: result }))
  // .catch((err: string) => { throw new InternalServerError(err) })
}

export const updateUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  // await updateUserService(String((request.params as any)?.id), request.body as any)
  // .then((result) => {
  //   if (!result) {
  //     throw new NotFoundError('User not found')
  //   }
  //   return reply.code(200).send({ data: result })
  // })
  // .catch((err: string) => { throw new InternalServerError(err) })
}

export const deleteUser = async (
  request: FastifyRequest,
  reply: FastifyReply
): Promise<any> => {
  
  // await deleteUserService(String((request.params as any)?.id))
  // .then((result) => reply.code(200).send({ data: result }))
  // .catch((err: string) => { throw new InternalServerError(err) })
}
