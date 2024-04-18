/* eslint-disable @typescript-eslint/no-misused-promises */
import { type FastifyPluginAsync, type FastifyInstance } from "fastify";
import {
  protect,
  restrictTo,
} from "../controller/auth.controller";
import { validateRequest } from "../middleware/validate";
import {
  getUser,
  findUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../controller/user.controller";
import { userSchema } from "../utils/validator";
import { applyRoutes } from "../utils/route";



const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorateRequest("user", "hello world");

  applyRoutes(fastify, [
    [ "", [], {},
      { get: [getUser], post: [validateRequest(userSchema), createUser] },
    ],
    [
      ":id", [], {},
      {
        get: [findUserById],
        put: [validateRequest(userSchema), updateUser],
        delete: [deleteUser],
      },
    ],
  ]);
};

export default userRoutes;
