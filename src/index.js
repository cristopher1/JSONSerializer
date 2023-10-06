import { ValidatorHandler } from './validators/handler/ValidatorHandler'
import { ContainsPropertyValidator } from './validators/ContainsPropertyValidator'
import { PropertyContainsValidTypeValidator } from './validators/PropertyContainsValidTypeValidator'
import { IsTypeValidator } from './validators/IsTypeValidator'
import { ReplacerBuilder } from './functionsBuilder/replacer/ReplacerBuilder'
import { ReviverBuilder } from './functionsBuilder/reviver/ReviverBuilder'
import { SerializerHandler } from './serializers/handler/SerializerHandler'
import { JsonSerializer } from './core/JSONSerializer'

/**
 * Builds a JsonSerializer object using the builder pattern. Every call to this
 * function generates a new instance of JsonSerializer.
 *
 * @returns {JsonSerializer} A new instance of JsonSerializer.
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
