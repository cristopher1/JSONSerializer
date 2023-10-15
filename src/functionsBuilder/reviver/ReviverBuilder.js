export class ReviverBuilder {
  #serializers

  /**
   * Object used to build the reviver function. That function is used by
   * JSON.parse method.
   */
  constructor() {
    this.#serializers = {}
  }

  /**
   * Sets Serializers. When the build method is called, the Serializers are
   * added to the reviver function.
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
   * Builds a reviver function using builder pattern.
   *
   * @returns {(key: string, value: any) => any} Reviver function used by
   *   JSON.parse method.
   */
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
