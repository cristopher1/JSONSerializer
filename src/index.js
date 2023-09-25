import { ValidatorHandler } from './ValidatorHandler/ValidatorHandler'
import { ContainsPropertyValidator } from './Validator/ContainsPropertyValidator'
import { PropertyContainsValidTypeValidator } from './Validator/PropertyContainsValidTypeValidator'
import { IsTypeValidator } from './Validator/IsTypeValidator'
import { ReplacerBuilder } from './JsonFunctionBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from './JsonFunctionBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from './SerializerHandler/SerializerHandler'
import { JsonSerializer } from './core/JsonSerializer'

export function buildJsonSerializer() {
  const serializerValidators = [
    new PropertyContainsValidTypeValidator(
      new ContainsPropertyValidator('getSerializerType'),
      new IsTypeValidator('function'),
    ),
    new PropertyContainsValidTypeValidator(
      new ContainsPropertyValidator('serialize'),
      new IsTypeValidator('function'),
    ),
    new PropertyContainsValidTypeValidator(
      new ContainsPropertyValidator('parse'),
      new IsTypeValidator('function'),
    ),
  ]

  return new JsonSerializer(
    new ReplacerBuilder(),
    new ReviverBuilder(),
    new SerializerHandler(new ValidatorHandler(serializerValidators)),
  )
}
