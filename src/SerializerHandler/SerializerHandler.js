export class SerializerHandler {
  #serializers
  #serializerValidator

  constructor(serializerValidator) {
    this.#serializers = {}
    this.#serializerValidator = serializerValidator
  }

  getSerializers() {
    const serializers = this.#serializers
    return { ...serializers }
  }

  #validate(serializerType, serializer) {
    const serializerValidator = this.#serializerValidator

    serializerValidator.validateSerializerType(serializerType)
    serializerValidator.validateSerializer(serializer)
  }

  addSerializer(serializerType, serializer) {
    this.#validate(serializerType, serializer)
    this.#serializers[serializerType] = serializer
  }
}
