import { ValidatorHandler } from './Validators/Handler/ValidatorHandler'
import { ContainsPropertyValidator } from './Validators/ContainsPropertyValidator'
import { PropertyContainsValidTypeValidator } from './Validators/PropertyContainsValidTypeValidator'
import { IsTypeValidator } from './Validators/IsTypeValidator'
import { ReplacerBuilder } from './FunctionsBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from './FunctionsBuilder/Reviver/ReviverBuilder'
import { SerializerHandler } from './Serializers/Handler/SerializerHandler'
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
