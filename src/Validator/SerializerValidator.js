import {
  SerializerHandlerSerializerTypeError,
  SerializerHandlerSerializerError,
} from './Error'

export class SerializerValidator {
  #requiredSerializerMethods

  constructor() {
    this.#requiredSerializerMethods = ['serialize', 'parse']
  }

  #serializerTypeIsString(serializerType) {
    if (typeof serializerType !== 'string') {
      throw new SerializerHandlerSerializerTypeError(
        '"serializerType" parameter, must be a string',
      )
    }
  }

  #serializerContainsRequiredMethod(serializer, requiredMethod) {
    if (
      !(requiredMethod in serializer) ||
      typeof serializer[requiredMethod] !== 'function'
    ) {
      throw new SerializerHandlerSerializerError(
        `"serializer" parameter not contain a ${requiredMethod} method`,
      )
    }
  }

  validateSerializerType(serializerType) {
    this.#serializerTypeIsString(serializerType)
  }

  validateSerializer(serializer) {
    const requiredMethods = this.#requiredSerializerMethods

    for (const requiredMethod of requiredMethods) {
      this.#serializerContainsRequiredMethod(serializer, requiredMethod)
    }
  }
}
