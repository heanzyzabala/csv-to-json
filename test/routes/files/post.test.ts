import request from 'supertest';
import { Express } from 'express';

import { setupApp } from '../../../src/main';
import * as fileService from '../../../src/services/file-service'

jest.mock('../../../src/services/file-service')
const mockedFileService = fileService as jest.Mocked<typeof fileService>

describe('post', () => {
  let app: Express

  beforeAll(async () => {
    app = await setupApp()
  })

  it('should successfully return result and processed rows', async () => {
    mockedFileService.download.mockResolvedValue('success')
    const json: any[] = [
      {
        key: {
          type: 'string',
          value: 'key',
        },
      },
    ]
    mockedFileService.toJSON.mockReturnValue(json)
    mockedFileService.zip.mockReturnValue(Buffer.from(json))
    mockedFileService.upload.mockResolvedValue('url')

    const response = await request(app)
      .post('/files/convert')
      .send({ source: 'source.csv' })
      .expect(200)

    expect(response.body.result).toEqual('url')
    expect(response.body.rows).toEqual(1)
  })

  it('should fail for additional properties', async () => {
    const response = await request(app)
      .post('/files/convert')
      .send({ additionalProp: '', source: 'sample.csv' })
      .expect(400)

    expect(response.body).toEqual({
      error: {
        code: 'BadRequest',
        message: 'Input validation error',
        details: [
          'body should NOT have additional properties \'additionalProp\'',
        ],
      },
    })
  })

  it('should fail when source property is empty', async () => {
    const response = await request(app)
      .post('/files/convert')
      .send({ source: '' })
      .expect(400)

    expect(response.body).toEqual({
      error: {
        code: 'BadRequest',
        message: 'Input validation error',
        details: [
          'body/source should NOT be shorter than 1 characters',
        ],
      },
    })
  })

  it('should fail when source property is missing', async () => {
    const response = await request(app)
      .post('/files/convert')
      .send({ })
      .expect(400)

    expect(response.body).toEqual({
      error: {
        code: 'BadRequest',
        message: 'Input validation error',
        details: [
          'body should have required property \'source\'',
        ],
      },
    })
  })
})

