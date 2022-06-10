import { Request, Response, NextFunction } from 'express'
import { v4 as uuid } from 'uuid'

import * as fileService from '../../services'
import { logger } from '../../shared'

export const post = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const requestId = req.headers['Request-Id'] || uuid()
  try {
    logger.info({ requestId }, 'Processing file')

    const csv = await fileService.download(req.body.source)
    const json = fileService.toJSON(csv)
    const zip = fileService.zip(json)
    const url = await fileService.upload(`${req.body.source}.zip`, zip)

    logger.info({ requestId }, 'Finished processing file')
    res.status(200).json({ result: url, rows: json.length })
  } catch (err) {
    logger.error({ requestId, err }, 'Failed to process file')
    next(err)
  }
}
