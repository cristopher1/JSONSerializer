import { ReplacerBuilderSerializerHandlerError } from '../Error'
import { Builder } from '../Builder'

export class ReplacerBuilder extends Builder {
  constructor(serializerHandler) {
    super(serializerHandler, ReplacerBuilderSerializerHandlerError)
  }

  getSavedSerializers() {
    return super.getSavedSerializers()
  }

  addSerializer(serializerType, serializer) {
    const serializerHandler = super.getSerializerHandler()
    serializerHandler.addSerializer(serializerType, serializer)
  }

  build() {
    const serializerHandler = super.getSerializerHandler()
    const serializers = serializerHandler.serializers
    const getSerializerType = (dataType) => {
      const type = typeof dataType
      return type === 'object' ? dataType.constructor.name.toLowerCase() : type
    }

    return function replacer(key, value) {
      const unserializedData = this[key]
      const dataType = unserializedData.__typeof__
      const serializerType = getSerializerType(dataType)
      const serializer = serializers[serializerType]
      if (serializer) {
        return serializer.serialize(unserializedData)
      }
      // Using serialized data by JSON.stringify algorithm
      return value
    }
  }
}
