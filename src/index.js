import { ValidatorHandler } from './ValidatorHandler/ValidatorHandler'
import { ContainsPropertyValidator } from './Validator/ContainsPropertyValidator'
import { PropertyContainsValidTypeValidator } from './Validator/PropertyContainsValidTypeValidator'
import { IsTypeValidator } from './Validator/IsTypeValidator'
import { ReplacerBuilder } from './JsonFunctionsBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from './JsonFunctionsBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from './SerializerHandler/SerializerHandler'
import { JsonSerializer } from './core/JSONSerializer'

/**
 * Builds a JsonSerializer object using the builder pattern. Every call to this
 * function generates a new instance of JsonSerializer.
 *
 * @returns {JsonSerializer} New instance of JsonSerializer.
 */
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
