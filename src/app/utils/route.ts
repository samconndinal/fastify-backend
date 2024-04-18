import { type FastifyInstance } from "fastify";

type RouteConfig = [
  string,
  any[],
  any,
  {
    [method: string]: any[];
  },
  any[]?
];

export const applyRoutes = (fastify: FastifyInstance, routeConfig: RouteConfig[]) => {
  routeConfig.forEach(([route, middleware, options, methods]) => {
    const routePath = `/${route}`;

    Object.entries(methods).forEach(([method, handlers]) => {
      (fastify[method as keyof FastifyInstance] as any)(
        routePath,
        options,
        ...middleware,
        ...handlers
      );
    });
  });
};
