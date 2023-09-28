export class ReviverBuilder {
  #serializers

  constructor() {
    this.#serializers = {}
  }

  setSerializers(serializers) {
    this.#serializers = serializers
  }

  build() {
    const serializers = this.#serializers

    return function reviver(key, value) {
      const serializerType = value.__typeof__
      const serializer = serializers[serializerType]
      if (serializer) {
        return serializer.parse(value)
      }
      // Using parsed data by JSON.parse algorithm
      return value
    }
  }
}
