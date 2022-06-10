import * as convict from 'convict'
import convictFormatWithValidator from 'convict-format-with-validator'
import * as dotenv from 'dotenv'
import errcode from 'err-code'

if (process.env.DOTENV) {
  dotenv.config({ path: process.env.DOTENV })
}
convict.addFormats(convictFormatWithValidator)

export const createConfig = <T>(config: T): (name: keyof T) => any => {
  // @ts-ignore
  const schema = convict.default<T>(config)
  schema.validate({ allowed: 'strict' })
  return (
    (name: keyof T): any => {
      if (!name) {
        throw errcode(new Error('Config name is required.'), 'InvalidConfig')
      }

      if (!schema.has(name)) {
        throw errcode(new Error(`Unknown config ${String(name)}`), 'InvalidConfig')
      }

      if (schema.get(name) !== null) {
        return schema.get(name)
      }
      throw errcode(new Error(`Environment variable ${(config[name] as any).env} is required`), 'InvalidConfig')
    }
  )
}
