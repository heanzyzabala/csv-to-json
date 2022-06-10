import * as bunyan from 'bunyan'
import Logger from 'bunyan'

import { CreateLoggerOptions } from './types'

export const createLogger = (
  option: CreateLoggerOptions,
): Logger => {
  return bunyan.createLogger({
    name: option.name,
    level: option.level,
    serializers: {
      err: bunyan.stdSerializers.err,
    },
  })
}
