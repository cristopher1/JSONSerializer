import { SerializerHandler } from '../../src/SerializerHandler/SerializerHandler'

export const getSerializerHandler = () => new SerializerHandler()
export const getSerializer = () => ({
  serialize: (value) => ({ value: value.toString() }),
  parse: (value) => value,
})
