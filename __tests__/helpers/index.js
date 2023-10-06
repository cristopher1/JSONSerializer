import { faker } from '@faker-js/faker'
import { SerializerHandler } from '../../src/Serializers/Handler/SerializerHandler'

faker.seed(27)

export const getSerializerHandler = (serializerValidatorHandler) => {
  return new SerializerHandler(serializerValidatorHandler)
}

export const getSerializer = (
  getSerializerTypeFunc,
  serializeFunc,
  parseFunc,
) => ({
  getSerializerType: getSerializerTypeFunc,
  serialize: serializeFunc,
  parse: parseFunc,
})

export { faker }
