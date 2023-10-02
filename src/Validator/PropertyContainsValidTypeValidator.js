import { Validator } from './Validator'

/**
 * @implements {Validator}
 */
export class PropertyContainsValidTypeValidator {
  #containsPropertyValidator
  #isTypeValidator

  constructor(containsPropertyValidator, isTypeValidator) {
    this.#containsPropertyValidator = containsPropertyValidator
    this.#isTypeValidator = isTypeValidator
  }

  validate(data) {
    const containsPropertyValidator = this.#containsPropertyValidator

    containsPropertyValidator.validate(data)

    const requiredPropertyName =
      containsPropertyValidator.getRequiredPropertyName()
    const requiredValue = data[requiredPropertyName]

    this.#isTypeValidator.validate(requiredValue)
  }
}
