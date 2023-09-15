import { ReplacerBuilderSerializerHandlerError } from '../Error'
import { Builder } from '../Builder'

export class ReplacerBuilder extends Builder {
  constructor(serializerHandler) {
    super(serializerHandler, ReplacerBuilderSerializerHandlerError)
  }

  get savedSerializers() {
    return super.savedSerializers
  }

  addSerializer(serializerType, serializer) {
    const serializerHandler = super.serializerHandler
    serializerHandler.addSerializer(serializerType, serializer)
  }

  getReplacer() {
    const serializerHandler = super.serializerHandler
    const serializers = serializerHandler.serializers
    const getSerializerType = (data) => {
      const type = typeof data
      return type === 'object' ? data.constructor.name.toLowerCase() : type
    }
    return function replacer(key, value) {
      const unserializedData = this[key]
      const serializerType = getSerializerType(unserializedData)
      const serializer = serializers[serializerType]
      if (serializer) {
        return serializer.serialize(unserializedData)
      }
      // Using serialized data by JSON.stringify algorithm
      return value
    }
  }
}
