export class JSONSerializer {
  #replacerBuilder
  #reviverBuilder
  #replacer
  #reviver

  set replacerBuilder(replacerBuilder) {
    this.#replacerBuilder = replacerBuilder
  }

  get replacerBuilder() {
    return this.#replacerBuilder
  }

  set reviverBuilder(reviverBuilder) {
    this.#reviverBuilder = reviverBuilder
  }

  get reviverBuilder() {
    return this.#reviverBuilder
  }

  #refreshJSONSerializer() {
    this.#refreshReplacer()
    this.#refreshReviver()
  }

  #refreshReplacer() {
    this.#replacer = this.#replacerBuilder.getReplacer()
  }

  #refreshReviver() {
    this.#reviver = this.#replacerBuilder.getReviver()
  }

  installPlugin(plugin, installOptions = {}) {
    const replacerBuilder = this.#replacerBuilder
    const reviverBuilder = this.#reviverBuilder

    plugin.install(replacerBuilder, reviverBuilder, installOptions)

    this.#refreshJSONSerializer()
  }

  addSerializer(serializer) {
    const replacerBuilder = this.#replacerBuilder
    const reviverBuilder = this.#reviverBuilder
    const serializerType = serializer.serializerType

    replacerBuilder.addSerializer(serializerType, serializer)
    reviverBuilder.addSerializer(serializerType, serializer)

    this.#refreshJSONSerializer()
  }

  serialize(data) {
    const replacer = this.#replacer
    return JSON.stringify(data, replacer)
  }

  parse(data) {
    const reviver = this.#reviver
    return JSON.parse(data, reviver)
  }
}
