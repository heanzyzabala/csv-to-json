import { Router } from 'express'
import * as files from './files'

export const setupRoutes = (router: Router) => {
  router.post('/files/extract', files.post)
}
