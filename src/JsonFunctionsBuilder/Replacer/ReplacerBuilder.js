export class ReplacerBuilder {
  #serializers

  /**
   * Object used to build the replacer function. That function is used by
   * JSON.stringify method.
   */
  constructor() {
    this.#serializers = {}
  }

  /**
   * Sets Serializers. When the build method is called, the Serializers are
   * added to the replacer function.
   *
   * @param {object} serializers An object that contains Serializers added to
   *   JsonSerializer object. The keys are obtained from
   *   Serializer.getSerializerType method and the values are the Serializer
   *   objects.
   */
  setSerializers(serializers) {
    this.#serializers = serializers
  }

  /**
   * Builds a replacer function using builder pattern.
   *
   * @returns {(key: string, value: any) => any} Replacer function used by
   *   JSON.stringify method.
   */
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
