import { createConfig } from './libs/config'
import { createLogger } from './libs/logger'
import { createS3Client } from './libs/s3'

export const config = createConfig({
  PORT: {
    env: 'PORT',
    format: '*',
    default: 3000,
  },
  AWS_REGION: {
    env: 'AWS_REGION',
    format: '*',
    default: null,
  },
  AWS_ACCESS_KEY_ID: {
    env: 'AWS_ACCESS_KEY_ID',
    format: '*',
    default: null,
  },
  AWS_SECRET_ACCESS_KEY: {
    env: 'AWS_SECRET_ACCESS_KEY',
    format: '*',
    default: null,
  },
  AWS_S3_BUCKET: {
    env: 'AWS_S3_BUCKET',
    format: '*',
    default: null,
  },
  LOG_LEVEL: {
    env: 'LOG_LEVEL',
    format: '*',
    default: 'info',
  },
})

export const s3 = createS3Client({
  region: config('AWS_REGION'),
  accessKeyId: config('AWS_ACCESS_KEY_ID'),
  secretAccessKey: config('AWS_SECRET_ACCESS_KEY'),
})

export const logger = createLogger({
  name: 'csv-to-json',
  level: config('LOG_LEVEL'),
})
