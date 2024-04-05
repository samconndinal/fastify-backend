/* eslint-disable @typescript-eslint/strict-boolean-expressions */
// import { type Knex } from 'knex'
// import { encryptPassword } from '../config/auth'
// import knex from '../config/knex'
// import { withTransaction } from '../config/transact'
// import { CustomError } from '../lib/errors'
import {
  createUserModel,
  deleteUserModel,
  findUserByEmail,
  getUserModel,
  updateUserModel
} from '../model/user.model'

export const search = async (
  page: number,
  limit: number
): Promise<any> => await getUserModel(page, limit)

export const create = async (body: any): Promise<any> => {
  // const { email, password } = body
  // const isUserExist = await findUserByEmail(String(email))

  // if (isUserExist.length > 0) {
  //   next(new CustomError('User already exist', 'Can not create user', 400))
  //   return
  // }
  // const passEncrypt = await encryptPassword(String(password))

  // return withTransaction(
  //   knex,
  //   async (trx: Knex) => createUserModel({
  //     username: body.username,
  //     email: body.email,
  //     password: passEncrypt,
  //     role: body.role
  //   }, trx)
  // )
}

// export const update = async (
//   id: string,
//   body: any
// ): Promise<any> => await withTransaction(knex, async (trx: Knex) => await updateUserModel(id, body, trx))

// export const destroy = async (
//   id: string
// ): Promise<any> => await withTransaction(knex, async (trx: Knex) => await deleteUserModel(id, trx))
