import { setupApp } from './main'
import { config, logger } from './shared'

Promise.all([setupApp()]).then(([app]) => {
  const server = app.listen(config('PORT'))
  logger.info(`Express server running at ::${config('PORT')}.`)

  process.on('SIGTERM', () => {
    server.close(() => {
      logger.info('Gracefully shutdown express server.')
    })
  })
}).catch((err) => {
  logger.error(err)
  process.exit(1)
})
