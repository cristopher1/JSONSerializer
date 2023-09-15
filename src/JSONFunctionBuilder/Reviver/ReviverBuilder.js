import { ReviverBuilderSerializerHandlerError } from '../Error'
import { Builder } from '../Builder'

export class ReviverBuilder extends Builder {
  constructor(serializerHandler) {
    super(serializerHandler, ReviverBuilderSerializerHandlerError)
  }

  get savedSerializers() {
    return super.savedSerializers
  }

  addSerializer(serializerType, serializer) {
    const serializerHandler = super.serializerHandler
    serializerHandler.addSerializer(serializerType, serializer)
  }

  getReviver() {
    const serializerHandler = super.serializerHandler
    const serializers = serializerHandler.serializers

    return function reviver(key, value) {
      const dataType = '__typeof__'
      const serializerType = value[dataType]
      const serializer = serializers[serializerType]
      if (serializer) {
        return serializer.parse(value)
      }
      // Using parsed data by JSON.parse algorithm
      return value
    }
  }
}
