export class JsonSerializer {
  #replacerBuilder
  #reviverBuilder
  #serializerHandler
  // function used for JSON.stringify (second parameter) to serialize data
  #replacer
  // function used for JSON.parse (second parameter) to unserialize data
  #reviver

  constructor(replacerBuilder, reviverBuilder, serializerHandler) {
    this.#replacerBuilder = replacerBuilder
    this.#reviverBuilder = reviverBuilder
    this.#serializerHandler = serializerHandler
  }

  #refreshJsonSerializer() {
    const serializerHandler = this.#serializerHandler
    const serializers = serializerHandler.getSerializers()

    this.#refreshReplacer(serializers)
    this.#refreshReviver(serializers)
  }

  #refreshReplacer(serializers) {
    const replacerBuilder = this.#replacerBuilder

    replacerBuilder.setSerializers(serializers)
    this.#replacer = replacerBuilder.build()
  }

  #refreshReviver(serializers) {
    const reviverBuilder = this.#reviverBuilder

    reviverBuilder.setSerializers(serializers)
    this.#reviver = reviverBuilder.build()
  }

  #installSerializers(serializersInstaller, installOptions) {
    const serializerHandler = this.#serializerHandler

    serializersInstaller.install(serializerHandler, installOptions)
  }

  #addSerializer(serializer) {
    const serializerHandler = this.#serializerHandler

    serializerHandler.addSerializer(serializer)
  }

  getSerializers() {
    const serializerHandler = this.#serializerHandler
    return serializerHandler.getSerializers()
  }

  installSerializersAndRefreshJsonSerializer(
    serializersInstaller,
    installOptions = {},
  ) {
    this.#installSerializers(serializersInstaller, installOptions)
    this.#refreshJsonSerializer()
  }

  addSerializerAndRefreshJsonSerializer(serializer) {
    this.#addSerializer(serializer)
    this.#refreshJsonSerializer()
  }

  serialize(data, space) {
    const replacer = this.#replacer
    return JSON.stringify(data, replacer, space)
  }

  parse(data) {
    const reviver = this.#reviver
    return JSON.parse(data, reviver)
  }
}
