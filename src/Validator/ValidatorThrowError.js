import { ValidatorError } from './Error'

export class ValidatorThrowError {
  #errorName

  constructor(errorName) {
    this.#errorName = errorName
  }

  throwError(data, errorDescription) {
    const errorName = this.#errorName
    const errorMessage = `Error in ${data}: ${errorDescription}`
    throw new ValidatorError(errorName, errorMessage)
  }
}
