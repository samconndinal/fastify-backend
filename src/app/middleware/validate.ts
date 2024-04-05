import { BadRequestError } from '@/core/errors'
import { type FastifyRequest, type FastifyReply } from 'fastify'

export const validateRequest = (schema: any) => async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    await schema.validate({
      body: request.body,
      query: request.query,
      params: request.params
    })
  } catch (err: any) {
    throw new BadRequestError(err.message as string)
  }
}
