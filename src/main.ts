import * as path from 'path'
import * as express from 'express'
// @ts-ignore
import healthcheck from 'express-healthcheck'
import * as swaggerValidator from 'openapi-validator-middleware'

import { errorHandler } from './error-handler'
import { setupRoutes } from './routes'

export const setupApp = async () => {
  const app = express.default()
  app.set('trust proxy', true)
  app.use(express.json())
  app.use('/healthcheck', healthcheck())

  const router = express.Router()
  const swaggerFile = path.join(__dirname, 'swagger.yaml')
  swaggerValidator.init(swaggerFile, { beautifyErrors: true })
  const methods = ['get', 'post', 'put', 'delete', 'patch', 'options', 'head']
  for (const method of methods) {
    // @ts-ignore
    const o = router[method]
    // @ts-ignore
    router[method] = (p, ...handlers) => {
      o.call(router, p, ...[swaggerValidator.validate, handlers])
    }
  }
  setupRoutes(router)
  app.use(router)
  app.use(errorHandler)
  return app
}
