/* eslint-disable @typescript-eslint/explicit-function-return-type */
import knex from '@/app/config/knex'
import { type Knex } from 'knex'

const table = 'user'

const userFields = [
  'user.id',
  'user.username',
  'user.email',
  'user.role'
]

export const getUser = async (
  page: number,
  limit: number
): Promise<any> => await knex(table)
  .select(userFields)
  .paginate({ perPage: limit, currentPage: page, isLengthAware: true })

export const createUser = async (body: any, trx: Knex) => await trx(table).insert(body).returning('id')

export const getUserById = async (id: string, trx: Knex) => await trx(table)
  .select(userFields)
  .where({ id })
  .first()

export const updateUser = async (id: string, body: any, trx: Knex) => await trx(table).update(body).where({ id }).returning('id')

export const deleteUser = async (id: string, trx: Knex) => await trx(table).del().where({ id }).returning('id')

export const findUserByEmail = async (email: string) => await knex(table).select('*').where({ email })
