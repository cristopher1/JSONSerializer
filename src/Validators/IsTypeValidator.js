import { InvalidTypeError } from './Error'
import { Validator } from './Validator'

/* eslint-disable valid-typeof */
/**
 * @throws {InvalidTypeError}
 * @implements {Validator}
 */
export class IsTypeValidator {
  #validType

  /**
   * Validates if the data is of the required type (this Validator validates
   * through typeof data).
   *
   * @param {string} validType The valid type expected. It must match the values
   *   returned by typeof operator.
   */
  constructor(validType) {
    this.#validType = validType
  }

  /**
   * Validates the data using the typeof operator to obtain the data type. If
   * they are invalid an Error is thrown.
   *
   * @param {any} data The data to validate.
   */
  validate(data) {
    const validType = this.#validType

    if (typeof data !== validType) {
      const message = `${data} should be ${validType}`
      throw new InvalidTypeError(message)
    }
  }
}
