import { Validator } from '../Validator/Validator'

export class ValidatorHandler {
  #validators

  /**
   * @param {Validator[]} validators Array that contains validator objects used
   *   to validate data.
   */
  constructor(validators) {
    this.#validators = validators
  }

  /** @param {any} data Data to validate. */
  validate(data) {
    const validators = this.#validators
    for (const validator of validators) {
      validator.validate(data)
    }
  }
}
