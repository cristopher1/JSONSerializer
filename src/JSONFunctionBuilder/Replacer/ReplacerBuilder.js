export class ReplacerBuilder {
  #serializers

  addSerializers(serializers) {
    this.#serializers = serializers
  }

  build() {
    const serializers = this.#serializers
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
