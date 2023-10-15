import { ValidatorHandler } from '../../validators/handler/ValidatorHandler'

export class SerializerHandler {
  #serializers
  #serializerValidatorHandler

  /**
   * Object used to manage the Serializer objects.
   *
   * @param {ValidatorHandler} [serializerValidatorHandler] A ValidatorHandler
   *   object used to validate Serializers.
   */
  constructor(serializerValidatorHandler) {
    this.#serializers = {}
    this.#serializerValidatorHandler = serializerValidatorHandler
  }

  /**
   * Returns an object that contains the Serializers added to JsonSerializer
   * object. The keys are obtained from Serializer.getSerializerType method and
   * the values are the Serializer objects.
   *
   * @returns {object} Object that contains the Serializers added to
   *   JsonSerializer object.
   */
  getSerializers() {
    const serializers = this.#serializers
    return { ...serializers }
  }

  /**
   * Validates a Serializer. If it is invalid an Error will be thrown.
   *
   * @param {object} serializer An object used to serialize and unserialize
   *   data.
   * @param {() => string} serializer.getSerializerType An function that return
   *   the type of serializer.
   * @param {(unserializedData: any) => object} serializer.serialize An function
   *   that serialize data.
   * @param {(serializedData: string) => any} serializer.parse An function that
   *   unserialize data.
   */
  #validate(serializer) {
    const serializerValidatorHandler = this.#serializerValidatorHandler
    if (serializerValidatorHandler) {
      serializerValidatorHandler.validate(serializer)
    }
  }

  /**
   * Adds a Serializer. If it is invalid an Error will be thrown.
   *
   * @param {object} serializer An object used to serialize and unserialize
   *   data.
   * @param {() => string} serializer.getSerializerType An function that return
   *   the type of Serializer.
   * @param {(unserializedData: any) => object} serializer.serialize An function
   *   that serialize data.
   * @param {(serializedData: string) => any} serializer.parse An function that
   *   unserialize data.
   */
  addSerializer(serializer) {
    this.#validate(serializer)

    const serializerType = serializer.getSerializerType()
    this.#serializers[serializerType] = serializer
  }
}
