import { BuilderAbstractClassError } from './Error'

export class Builder {
  #serializerHandler

  constructor(serializerHandler, ErrorBuilder) {
    if (this.constructor === Builder) {
      throw new BuilderAbstractClassError('Builder is an abstract class')
    }
    if (!('addSerializer' in serializerHandler)) {
      throw new ErrorBuilder(
        '"serializerHandler" parameter must contain an addSerializer property',
      )
    }
    if (typeof serializerHandler.addSerializer !== 'function') {
      throw new ErrorBuilder(
        'serializerHandler.addSerializer must be a function',
      )
    }
    this.#serializerHandler = serializerHandler
  }

  get serializerHandler() {
    return this.#serializerHandler
  }

  get savedSerializers() {
    const serializerHandler = this.#serializerHandler
    return serializerHandler.savedSerializers
  }
}
