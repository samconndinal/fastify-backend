import type express from 'express'
import { type NextFunction, type Request, type Response, type Router } from 'express'

interface Route {
  path: string
  router: express.Router
}

type HttpMethod = 'get' | 'post' | 'put' | 'delete'
type MiddlewareFunction = (req: Request, res: Response, next: NextFunction) => Promise<void>
export type RouteDetails = [string, MiddlewareFunction[], MiddlewareFunction]

export function applyRoutes (routes: Record<HttpMethod, RouteDetails[]>, route: Router): void {
  Object.entries(routes).forEach(([method, routeDetails]) => {
    routeDetails.forEach(([path, middleware, handler]) => {
      (route[method as HttpMethod] as any)(path, ...middleware, handler)
    })
  })
}

const useRoutes = (app: express.Application, routes: Route[]): void => {
  routes.forEach((route) => {
    app.use(route.path, route.router)
  })
}

export default useRoutes
