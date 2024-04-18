/* eslint-disable @typescript-eslint/explicit-function-return-type */
import knex from '@/app/config/knex'
import { getPagination } from '@/core/helpers';
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
): Promise<any> => {
  const offset = (page - 1) * limit;
  const users = await knex(table)
    .select(userFields)
    .limit(limit)
    .offset(offset);

  // Estimate the total number of users
  const total = await knex.raw(
    `SELECT reltuples AS approximate_row_count FROM pg_class WHERE relname = ?`,
    [table]
  );
  const pagination = getPagination(total.rows[0].approximate_row_count, page, limit);
  return {
    data: users,
    pagination
  };
};

export const createUser = async (body: any, trx: Knex) => await trx(table).insert(body).returning('id')

export const getUserById = async (id: string) => {
  const users = await knex(table).select('*').where({ id });
  return users[0];
}

export const updateUser = async (id: string, body: any, trx: Knex) => await trx(table).update(body).where({ id }).returning('id')

export const deleteUser = async (id: string, trx: Knex) => await trx(table).del().where({ id }).returning('id')

export const findUserByEmail = async (email: string) => await knex(table).select('*').where({ email })
