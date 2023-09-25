import { ValidatorThrowError } from './ValidatorThrowError'

/* eslint-disable valid-typeof */
export class IsTypeValidator extends ValidatorThrowError {
  #validType

  constructor(validType) {
    super('Incorrect type')
    this.#validType = validType
  }

  validate(data) {
    const validType = this.#validType

    if (typeof data !== validType) {
      const errorDescription = `The value expected is ${validType}`
      super.throwError(data, errorDescription)
    }
  }
}
