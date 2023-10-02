import { Validator } from '../Validator/Validator'

export class ValidatorHandler {
  #validators

  /**
   *
   * @param {Validator[]} validators Validator array used to validate data
   */
  constructor(validators) {
    this.#validators = validators
  }

  validate(data) {
    const validators = this.#validators
    for (const validator of validators) {
      validator.validate(data)
    }
  }
}
