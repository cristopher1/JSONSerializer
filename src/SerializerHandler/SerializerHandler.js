export class SerializerHandler {
  #serializers
  #serializerValidatorHandler

  constructor(serializerValidatorHandler) {
    this.#serializers = {}
    this.#serializerValidatorHandler = serializerValidatorHandler
  }

  getSerializers() {
    const serializers = this.#serializers
    return { ...serializers }
  }

  #validate(serializer) {
    const serializerValidatorHandler = this.#serializerValidatorHandler
    if (serializerValidatorHandler) {
      serializerValidatorHandler.validate(serializer)
    }
  }

  addSerializer(serializer) {
    this.#validate(serializer)

    const serializerType = serializer.getSerializerType()
    this.#serializers[serializerType] = serializer
  }
}
