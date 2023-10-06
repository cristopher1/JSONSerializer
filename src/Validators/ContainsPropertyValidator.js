import { ValidatorThrowError } from './ValidatorThrowError'

export class ContainsPropertyValidator extends ValidatorThrowError {
  #requiredPropertyName

  /**
   * Validates if the data contains the required property.
   *
   * @param {string} requiredPropertyName The name of the required property.
   */
  constructor(requiredPropertyName) {
    super('Property not found')
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
      const errorDescription = `Does not exist the property ${requiredPropertyName}`
      super.throwError(data, errorDescription)
    }
  }
}
