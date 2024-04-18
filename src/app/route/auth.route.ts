/* eslint-disable @typescript-eslint/no-misused-promises */
import { type FastifyPluginAsync, type FastifyInstance } from "fastify";
import {
  login,
  signup,
} from "../controller/auth.controller";
import { applyRoutes } from "../utils/route";



const userRoutes: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.decorateRequest("user", "hello world");

  applyRoutes(fastify, [
    ["sign-up", [], {}, { post: [signup] }],
    ["login", [], {}, { post: [login] }],
  ]);
};

export default userRoutes;
