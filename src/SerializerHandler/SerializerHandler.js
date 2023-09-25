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

  addSerializer(serializer) {
    this.#serializerValidatorHandler.validate(serializer)

    const serializerType = serializer.getSerializerType()
    this.#serializers[serializerType] = serializer
  }
}
