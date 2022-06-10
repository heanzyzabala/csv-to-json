import * as fileService from '../../src/services'


jest.mock('aws-sdk', () => {
  return {
    S3: jest.fn(() => ({
      getObject: (params: { Bucket: string, Key: string }) => {
        return {
          promise: () => {
            if (params.Key === 'fail.csv') {
              return Promise.reject({ code: 'NoSuchKey' })
            }
            return Promise.resolve({ Body: 'success'})
          }
        }
      },
      putObject: () => {
        return {
          promise: () => {
            return Promise.resolve('success')
          }
        }
      },
      getSignedUrlPromise: () => Promise.resolve('success')
    }))
  }
})

describe('file-service', () => {

  describe('download', () => {
    it('should download file', async () => {
      const file = await fileService.download('sample.csv')
      expect(file).toEqual('success')
    })

    it('should throw NotFound when file does not exist', async () => {
      await expect(fileService.download('fail.csv')).rejects.toThrowError('File not found')
    })
  })

  describe('upload', () => {
    it('should upload file and sign url', async () => {
      const url = await fileService.upload('/sample.csv.zip', 'sample data')
      expect(url).toEqual('success')
    })
  })

  describe('zip', () => {
    it('should zip files', async () => {
      const files: any[] = [
        { key: 1 },
        { key: 2 },
      ]
      const buffer = fileService.zip(files)
      expect(Buffer.from(files).compare(buffer)).toBeTruthy()
    })
  })

  describe('toJSON', () => {
    it('should extract and format csv to json', () => {
      const columns = 'column1,column2,column3,column4'
      const row1 = 'row1,123,810-292-9388,sample@gmail.com'
      const row2 = '321,sample@protonmail.com,322-313-7422,row2'
      const json = fileService.toJSON(`${columns}\n${row1}\n${row2}`)
  
      expect(json.length).toEqual(2)
      expect(json[0]).toEqual({
        column1: {
          type: 'string',
          value: 'row1',
        },
        column2: {
          type: 'number',
          value: '123',
        },
        column3: {
          type: 'phoneNumber',
          value: '810-292-9388',
        },
        column4: {
          type: 'emailAddress',
          value: 'sample@gmail.com',
        },
      })
      expect(json[1]).toEqual({
        column1: {
          type: 'number',
          value: '321',
        },
        column2: {
          type: 'emailAddress',
          value: 'sample@protonmail.com',
        },
        column3: {
          type: 'phoneNumber',
          value: '322-313-7422',
        },
        column4: {
          type: 'string',
          value: 'row2',
        },
      })
    })
  
    it('should throw when csv column count is invalid', () => {
      try {
        const columns = 'column1'
        const row1 = 'row1,row2'
        fileService.toJSON(`${columns}\n${row1}`)
      } catch (err: any) {
        expect(err.message).toMatch('Invalid Record Length')
      }
    })

    it('should throw when csv record is empty', () => {
      expect(() => fileService.toJSON('')).toThrowError('Empty record')
    })
  })

  describe('findType', () => {
    it.each([
      ['row1', 'string'],
      ['123', 'number'],
      ['800-100-1000', 'phoneNumber'],
      ['sample@gmail.com', 'emailAddress'],
    ])('should evaluate type for text: %s', (text, type) => {
      expect(fileService.findType(text)).toEqual(type)
    })
  })
})