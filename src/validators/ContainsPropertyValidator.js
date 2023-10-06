import { DoesNotContainPropertyError } from './Error'
import { Validator } from './Validator'

/**
 * @throws {DoesNotContainPropertyError}
 * @implements {Validator}
 */
export class ContainsPropertyValidator {
  #requiredPropertyName

  /**
   * Validates if the data contains the required property.
   *
   * @param {string} requiredPropertyName The name of the required property.
   */
  constructor(requiredPropertyName) {
    this.#requiredPropertyName = requiredPropertyName
  }

  /**
   * Returns the name of the required property to find.
   *
   * @returns {string} The name of the required property to find.
   */
  getRequiredPropertyName() {
    return this.#requiredPropertyName
  }

  /**
   * Validates the data. If they are invalid an Error is thrown.
   *
   * @param {any} data The data to validate.
   */
  validate(data) {
    const requiredPropertyName = this.#requiredPropertyName

    if (!(requiredPropertyName in data)) {
      const message = `${data} should include the ${requiredPropertyName} property`
      throw new DoesNotContainPropertyError(message)
    }
  }
}
