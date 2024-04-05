import { type FastifyPluginCallback, type FastifyInstance, type FastifyReply, type FastifyRequest, type RouteShorthandOptions } from 'fastify'

interface Route {
  path: string
  router: FastifyPluginCallback
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE'
type MiddlewareFunction = (req: FastifyRequest, res: FastifyReply) => Promise<void>
export type RouteDetails = [string, RouteShorthandOptions, MiddlewareFunction]

export function applyRoutes (routes: Record<HttpMethod, RouteDetails[]>, route: FastifyInstance): void {
  Object.entries(routes).forEach(([method, routeDetails]) => {
    routeDetails.forEach(([path, opts, handler]) => {
      (route[method.toLowerCase() as HttpMethod] as any)(path, opts, handler)
    })
  })
}

const useRoutes = (app: FastifyInstance, routes: Route[]): void => {
  routes.forEach((route) => {
    void app.register(route.router, { prefix: route.path })
  })
}

export default useRoutes
