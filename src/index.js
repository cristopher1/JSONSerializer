import { SerializerValidator } from './Validator/SerializerValidator'
import { ReplacerBuilder } from './JSONFunctionBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from './JSONFunctionBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from './SerializerHandler/SerializerHandler'
import { JSONSerializer } from './core/JSONSerializer'

const serializerValidator = new SerializerValidator()
const serializerHandler = new SerializerHandler(serializerValidator)
const replacerBuilder = new ReplacerBuilder()
const reviverBuilder = new ReviverBuilder()

export default new JSONSerializer(
  replacerBuilder,
  reviverBuilder,
  serializerHandler,
)
