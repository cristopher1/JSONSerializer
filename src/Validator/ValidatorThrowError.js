import { Validator } from './Validator'
import { ValidatorError } from './Error'

/** @implements {Validator} */
export class ValidatorThrowError {
  #errorName

  /** @param {string} errorName The name of the error to throw. */
  constructor(errorName) {
    this.#errorName = errorName
  }

  /**
   * Throws an error when the data are invalid.
   *
   * @param {any} data The invalid data.
   * @param {string} errorDescription A description that indicates the problems
   *   found.
   */
  throwError(data, errorDescription) {
    const errorName = this.#errorName
    const errorMessage = `Error in ${data}: ${errorDescription}`
    throw new ValidatorError(errorName, errorMessage)
  }
}
