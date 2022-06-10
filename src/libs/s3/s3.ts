import { S3 } from 'aws-sdk'

export interface CreateS3ClientOptions {
  region: string,
  accessKeyId: string,
  secretAccessKey: string,
}

export const createS3Client = (
  options: CreateS3ClientOptions,
): S3 => new S3({
  region: options.region,
  credentials: {
    accessKeyId: options.accessKeyId,
    secretAccessKey: options.secretAccessKey,
  },
})
