/* eslint-disable @typescript-eslint/no-unsafe-argument */
import fastify, { type FastifyInstance } from 'fastify'
import { fastifyRequestContext } from '@fastify/request-context'
import cors from '@fastify/cors'
import helmet from '@fastify/helmet'
import rateLimit from '@fastify/rate-limit'
import type { FastifyCookieOptions } from '@fastify/cookie'
import cookie from '@fastify/cookie'
import {
  rateLimitPluginOptions,
  type FastifyPlugin
} from './plugins'
import { serverConfig } from '@/app/config'
import { routes } from '@/app/route'
import { onDataBaseConnected } from '@/app/config/knex'
import { exec } from 'child_process'

export const Server = {
  new (): FastifyInstance {
    /* disable request logging during testing */
    const app = fastify({ logger: true })
    const cookieOptions: FastifyCookieOptions = {
      secret: 'my-secret', // for cookies signature
      parseOptions: {} // options for parsing cookies
    }

    const MAX_RETRIES = 5
    let retryCount = 0

    const databaseConnect = async (): Promise<void> => {
      try {
        await onDataBaseConnected()
        console.log('Database connected successfully')
      } catch (err) {
        console.log(err)
        retryCount++
        if (retryCount < MAX_RETRIES) {
          console.log(`Retry attempt ${retryCount}...`)
          // Wait for 2 seconds before retrying
          setTimeout(() => {
            void databaseConnect()
          }, 2000)
        } else {
          console.log('Max retries reached. Restarting application...')
          // Restart the application
          exec('npm run start:dev', (error, stdout, stderr) => { // for production use 'npm run start'
            if (error != null) {
              console.error(`exec error: ${JSON.stringify(error)}`)
              return
            }
            console.log(`stdout: ${stdout}`)
            console.error(`stderr: ${stderr}`)
          })
        }
      }
    }

    void databaseConnect()

    /* register all plugins */

    void app
      .register(cors)
      .register(helmet, { global: true })
      .register(rateLimit, rateLimitPluginOptions)
      .register(fastifyRequestContext)
      .register(cookie, cookieOptions)

    routes.forEach((route) => {
      void app.register(route.router, { prefix: route.path })
    })

    return app
  },

  /**
   * start the web server process on the provided port
   * promise is used so the caller can know when the server has finished
   * initialization
   */
  async start (app: FastifyInstance): Promise<void> {
    await new Promise((_resolve, reject) => {
      app.listen(serverConfig, (err) => {
        if (err != null) {
          reject(err)
        }
      })
    })
  },

  /** construct a miminal server to testing purposes */
  newTestServer (router: FastifyPlugin): FastifyInstance {
    const instance = fastify({ logger: false })
    void instance.register(router)

    return instance
  }
}
