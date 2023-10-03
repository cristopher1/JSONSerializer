import { ValidatorThrowError } from './ValidatorThrowError'

/* eslint-disable valid-typeof */
export class IsTypeValidator extends ValidatorThrowError {
  #validType

  /**
   * @param {string} validType The valid type expected. It must match the values
   *   returned by typeof operator.
   */
  constructor(validType) {
    super('Incorrect type')
    this.#validType = validType
  }

  /**
   * Validates the data using the typeof operator to obtain the data type. If
   * they are invalid an error is thrown.
   *
   * @param {any} data The data to validate.
   */
  validate(data) {
    const validType = this.#validType

    if (typeof data !== validType) {
      const errorDescription = `The value expected is ${validType}`
      super.throwError(data, errorDescription)
    }
  }
}
