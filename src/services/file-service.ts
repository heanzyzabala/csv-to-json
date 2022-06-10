import errcode from 'err-code'
import { parse } from 'csv-parse/sync'
import Admzip from 'adm-zip'

import { s3, config } from '../shared'

export const download = async (path: string): Promise<string> => {
  try {
    const file = await s3.getObject({
      Bucket: config('AWS_S3_BUCKET'),
      Key: path,
    }).promise()

    return (file.Body && file.Body.toString()) || ''
  } catch (err: any) {
    if (err.code && err.code === 'NoSuchKey') {
      throw errcode(new Error('File not found'), 'NotFound')
    }
    throw err
  }
}

export const upload = async (path: string, data: any): Promise<string> => {
  await s3.putObject({
    Bucket: config('AWS_S3_BUCKET'),
    Key: path,
    Body: data,
  }).promise()

  return s3.getSignedUrlPromise('getObject', {
    Bucket: config('AWS_S3_BUCKET'),
    Key: path,
  })
}

export const zip = (files: any[]): Buffer => {
  const zp = new Admzip()
  files.forEach((o, i) => {
    zp.addFile(`row-${i + 1}.json`, Buffer.from(JSON.stringify(o), 'utf8'))
  })
  return zp.toBuffer()
}

export const toJSON = (data: string): any[] => {
  const records = parse(data, { delimiter: ',' })

  if (!data || !records.length || !records[1]) {
    throw errcode(new Error('Empty record'), 'Unprocessable')
  }

  const columns = records[0]
  const rows = records.slice(1)
  const json = []

  for (let i = 0; i < rows.length; i++) {
    const rowItems = rows[i]
    const entry: any = {}
    for (let k = 0; k < columns.length; k++) {
      const item = rowItems[k] ?? ''
      entry[columns[k]] = {
        type: findType(item),
        value: item,
      }
    }
    json.push(entry)
  }
  return json
}

export const findType = (text: string): string => {
  if (/^\d+$/.test(text)) {
    return 'number'
  }

  if (/^(.+)@(.+)$/.test(text)) {
    return 'emailAddress'
  }

  if (/^\d{3}-\d{3}-\d{4}$/.test(text)) {
    return 'phoneNumber'
  }

  return 'string'
}
