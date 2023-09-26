export class ReviverBuilder {
  #serializers

  setSerializers(serializers) {
    this.#serializers = serializers
  }

  build() {
    const serializers = this.#serializers

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
