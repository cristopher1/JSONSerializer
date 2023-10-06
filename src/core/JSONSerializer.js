import { ReplacerBuilder } from '../FunctionsBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from '../FunctionsBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from '../Serializers/Handler/SerializerHandler'

/**
 * @callback replacer
 * @param {string} key
 * @param {any} value
 */

/**
 * @callback reviver
 * @param {string} key
 * @param {any} value
 */

export class JsonSerializer {
  #replacerBuilder
  #reviverBuilder
  #serializerHandler
  /**
   * @type {replacer} Function Used for JSON.stringify (second parameter) to
   *   serialize data.
   */
  #replacer
  /**
   * @type {reviver} Function Used for JSON.parse (second parameter) to
   *   unserialize data.
   */
  #reviver

  /**
   * JSON wrapper used to extend the functionality of JSON.stringify and
   * JSON.parse methods through Serializers.
   *
   * @param {ReplacerBuilder} replacerBuilder The object used to obtain the
   *   replacer function.
   * @param {ReviverBuilder} reviverBuilder The object used to obtain the
   *   reviver function.
   * @param {SerializerHandler} serializerHandler The object used to manage the
   *   Serializer objects.
   */
  constructor(replacerBuilder, reviverBuilder, serializerHandler) {
    this.#replacerBuilder = replacerBuilder
    this.#reviverBuilder = reviverBuilder
    this.#serializerHandler = serializerHandler
  }

  /** Refreshes the JsonSerializer object. */
  #refreshJsonSerializer() {
    const serializerHandler = this.#serializerHandler
    const serializers = serializerHandler.getSerializers()

    this.#refreshReplacer(serializers)
    this.#refreshReviver(serializers)
  }

  /**
   * Refreshes the replacer function.
   *
   * @param {object} serializers Object that contains the Serializers added to
   *   JsonSerializer object.
   */
  #refreshReplacer(serializers) {
    const replacerBuilder = this.#replacerBuilder

    replacerBuilder.setSerializers(serializers)
    this.#replacer = replacerBuilder.build()
  }

  /**
   * Refreshes the reviver function.
   *
   * @param {object} serializers Object that contains the Serializers added to
   *   JsonSerializer object.
   */
  #refreshReviver(serializers) {
    const reviverBuilder = this.#reviverBuilder

    reviverBuilder.setSerializers(serializers)
    this.#reviver = reviverBuilder.build()
  }

  /**
   * Adds serializers through the serializersInstaller object.
   *
   * @param {object} serializersInstaller An object that adds serializers using
   *   the install method.
   * @param {(
   *   serializerHandler: SerializerHandler,
   *   installOptions: object,
   * ) => void} serializersInstaller.install
   *   The method used to add serializers to JsonSerializer object.
   * @param {object} [installOptions] An object that contains the install
   *   options.
   */
  #installSerializers(serializersInstaller, installOptions) {
    const serializerHandler = this.#serializerHandler

    serializersInstaller.install(serializerHandler, installOptions)
  }

  /**
   * @param {object} serializer An object used to serialize and unserialize
   *   data.
   * @param {() => string} serializer.getSerializerType An function that return
   *   the type of serializer.
   * @param {(unserializedData: any) => object | string} serializer.serialize
   *   An function that serialize data.
   * @param {(serializedData: string) => any} serializer.parse An function that
   *   unserialize data.
   */
  #addSerializer(serializer) {
    const serializerHandler = this.#serializerHandler

    serializerHandler.addSerializer(serializer)
  }

  /**
   * Returns an object that contains the serializers added to JsonSerializer
   * object. The keys are obtained from serializer.getSerializerType method and
   * the values are the Serializer objects.
   *
   * @returns {object} Object that contains the serializers added to
   *   JsonSerializer object.
   */
  getSerializers() {
    const serializerHandler = this.#serializerHandler
    return serializerHandler.getSerializers()
  }

  /**
   * Adds serializers through the serializersInstaller and to update the
   * JsonSerializer object.
   *
   * @param {object} serializersInstaller An object that adds serializers using
   *   the install method.
   * @param {(
   *   serializerHandler: SerializerHandler,
   *   installOptions: object,
   * ) => void} serializersInstaller.install
   *   The method used to add serializers to JsonSerializer object.
   * @param {object} [installOptions] An object that contains the install
   *   options.
   */
  installSerializersAndRefreshJsonSerializer(
    serializersInstaller,
    installOptions = {},
  ) {
    this.#installSerializers(serializersInstaller, installOptions)
    this.#refreshJsonSerializer()
  }

  /**
   * Adds a Serializer and to update the JsonSerializer object.
   *
   * @param {object} serializer An object used to serialize and unserialize
   *   data.
   * @param {() => string} serializer.getSerializerType An function that returns
   *   the type of serializer.
   * @param {(unserializedData: any) => object | string} serializer.serialize
   *   An function that serializes data.
   * @param {(serializedData: string) => any} serializer.parse An function that
   *   unserializes data.
   */
  addSerializerAndRefreshJsonSerializer(serializer) {
    this.#addSerializer(serializer)
    this.#refreshJsonSerializer()
  }

  /**
   * Transforms a javascript value to a JSON string using JSON.stringify method.
   *
   * According to JSON.stringify's documentation the parameters represent.
   *
   * @param {any} unserializedData A javascript value, usually an object or
   *   array, to be converted.
   * @param {string | number} space Adds indentation, white space, and line
   *   break characters to the return-value JSON text to make it easier to
   *   read.
   * @returns {string} A JSON string generated by JSON.stringify method.
   */
  serialize(unserializedData, space) {
    const replacer = this.#replacer
    return JSON.stringify(unserializedData, replacer, space)
  }

  /**
   * Transform a JSON string to a javascript value using JSON.parse method.
   *
   * According to JSON.parse's documentation the parameters represent.
   *
   * @param {string} serializedData A valid JSON string.
   * @returns {any} A javascript value generated by JSON.parse method.
   */
  parse(serializedData) {
    const reviver = this.#reviver
    return JSON.parse(serializedData, reviver)
  }
}
