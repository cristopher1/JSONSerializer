export class ReplacerBuilder {
  #serializers

  setSerializers(serializers) {
    this.#serializers = serializers
  }

  build() {
    const serializers = this.#serializers
    const getSerializerType = (unserializedData) => {
      const type = typeof unserializedData
      return type === 'object' ? unserializedData.constructor.name : type
    }

    return function replacer(key, value) {
      const unserializedData = this[key]
      const serializerType = getSerializerType(unserializedData)
      const serializer = serializers[serializerType]
      if (serializer) {
        const serializedData = serializer.serialize(unserializedData)
        return {
          __typeof__: serializerType,
          ...serializedData,
        }
      }
      // Using serialized data by JSON.stringify algorithm
      return value
    }
  }
}
