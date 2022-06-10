import { Request, Response, NextFunction } from 'express'

export interface Err {
  code: string | null | undefined
  message: string | null | undefined
  details: any[] | null | undefined
  errors?: any
}

export const errorHandler = (
  err: Err,
  _req: Request,
  res: Response,
  _next: NextFunction,
): any => {
  const { code, message, details } = err

  // if error came from openapi validator
  if (message === 'Input validation error') {
    return res.status(400).json(createError({ code: 'BadRequest', message, details: err.errors }))
  }

  if (code && code.includes('BadRequest')) {
    return res.status(400).json(createError(err))
  }

  if (code && code.includes('NotFound')) {
    return res.status(404).json(createError(err))
  }

  if (code && code.includes('NotFound')) {
    return res.status(244).json(createError(err))
  }

  res.status(500).json(createError({ code: 'InternalServerError', message, details }))
}

const createError = ({ code, message, details }: Err) => ({
  error: {
    code,
    message,
    details: details ?? [],
  },
})
