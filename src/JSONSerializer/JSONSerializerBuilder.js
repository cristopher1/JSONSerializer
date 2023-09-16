import { JSONSerializer } from './JSONSerializer'
import { ReplacerBuilder } from '../JSONFunctionBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from '../JSONFunctionBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from '../SerializerHandler/SerializerHandler'

export class JSONSerializerBuilder {
  #serializer

  createNewJsonSerializer() {
    this.#serializer = new JSONSerializer()
  }

  setReplacerBuilder() {
    const serializerHandler = new SerializerHandler()
    const replacerBuilder = new ReplacerBuilder(serializerHandler)
    this.#serializer.replacerBuilder = replacerBuilder
  }

  setReviverBuilder() {
    const serializerHandler = new SerializerHandler()
    const reviverBuilder = new ReviverBuilder(serializerHandler)
    this.#serializer.reviverBuilder = reviverBuilder
  }

  getJSONSerializer() {
    return this.#serializer
  }
}
