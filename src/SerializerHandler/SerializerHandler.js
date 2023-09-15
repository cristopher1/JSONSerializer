import {
  SerializerHandlerSerializerTypeError,
  SerializerHandlerSerializerError,
} from './Error'

export class SerializerHandler {
  #serializers

  constructor() {
    this.#serializers = {}
  }

  get serializers() {
    return this.#serializers
  }

  get savedSerializers() {
    const serializers = this.#serializers
    return { ...serializers }
  }

  #validateSerializerType(serializerType) {
    if (typeof serializerType !== 'string') {
      throw new SerializerHandlerSerializerTypeError(
        '"serializerType" parameter, must be a string',
      )
    }
  }

  #validateSerializeMethod(serializer) {
    if (!('serialize' in serializer)) {
      throw new SerializerHandlerSerializerError(
        '"serializer" parameter not contain a serialize property',
      )
    } else if (typeof serializer.serialize !== 'function') {
      throw new SerializerHandlerSerializerError(
        '"serializer.serialize" must be a function',
      )
    }
  }

  #validateParseMethod(serializer) {
    if (!('parse' in serializer)) {
      throw new SerializerHandlerSerializerError(
        '"serializer" parameter not contain a parse property',
      )
    } else if (typeof serializer.parse !== 'function') {
      throw new SerializerHandlerSerializerError(
        '"serializer.parse" must be a function',
      )
    }
  }

  addSerializer(serializerType, serializer) {
    this.#validateSerializerType(serializerType)
    this.#validateSerializeMethod(serializer)
    this.#validateParseMethod(serializer)
    this.#serializers[serializerType] = serializer
  }
}
