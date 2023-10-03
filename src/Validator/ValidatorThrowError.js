import { Validator } from './Validator'
import { ValidatorError } from './Error'

/**
 * @abstract
 * @implements {Validator}
 */
export class ValidatorThrowError {
  #errorName

  /**
   * This class is extended when a Validator class must throw an Error within
   * its validate method.
   *
   * @param {string} errorName The name of the Error to throw.
   */
  constructor(errorName) {
    this.#errorName = errorName
  }

  /**
   * Throws an Error when the data are invalid.
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
