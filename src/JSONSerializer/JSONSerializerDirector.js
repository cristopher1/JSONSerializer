import { JSONSerializerBuilder } from './JSONSerializerBuilder'

class JSONSerializerDirector {
  #builder

  constructor(builder) {
    this.#builder = builder
  }

  makeJsonSerializer() {
    const builder = this.#builder

    builder.createNewJsonSerializer()
    builder.setReplacerBuilder()
    builder.setReviverBuilder()

    return builder.getJSONSerializer()
  }
}

const jsonSerializerBuilder = new JSONSerializerBuilder()
const jsonSerializerDirector = new JSONSerializerDirector(jsonSerializerBuilder)

export default jsonSerializerDirector
