import { ContainsPropertyValidator } from './ContainsPropertyValidator'
import { DoesNotContainPropertyError, InvalidTypeError } from './Error'
import { IsTypeValidator } from './IsTypeValidator'
import { Validator } from './Validator'

/**
 * @throws {DoesNotContainPropertyError}
 * @throws {InvalidTypeError}
 * @implements {Validator}
 */
export class PropertyContainsValidTypeValidator {
  #containsPropertyValidator
  #isTypeValidator

  /**
   * Validates if the data contains the required property and this is of the
   * required type.
   *
   * @param {ContainsPropertyValidator} containsPropertyValidator A
   *   containsPropertyValidator object.
   * @param {IsTypeValidator} isTypeValidator An IsTypeValidator object.
   */
  constructor(containsPropertyValidator, isTypeValidator) {
    this.#containsPropertyValidator = containsPropertyValidator
    this.#isTypeValidator = isTypeValidator
  }

  /**
   * Validates the data. If they are invalid an Error is thrown.
   *
   * @param {any} data The data to validate.
   */
  validate(data) {
    const containsPropertyValidator = this.#containsPropertyValidator

    containsPropertyValidator.validate(data)

    const requiredPropertyName =
      containsPropertyValidator.getRequiredPropertyName()
    const requiredValue = data[requiredPropertyName]

    this.#isTypeValidator.validate(requiredValue)
  }
}
