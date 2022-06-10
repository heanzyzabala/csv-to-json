import { Request, Response, NextFunction } from 'express'

import * as fileService from '../../services'
import { logger } from '../../shared'

export const post = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const csv = await fileService.download(req.body.source)
    const json = fileService.toJSON(csv)
    const zip = fileService.zip(json)
    const url = await fileService.upload(`${req.body.source}.zip`, zip)
    res.status(200).json({ result: url, rows: json.length })
  } catch (err) {
    next(err)
  }
}
