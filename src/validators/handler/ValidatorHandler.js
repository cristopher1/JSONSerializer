import { Validator } from '../Validator'

export class ValidatorHandler {
  #validators

  /**
   * Object used to manage the validation through Validator objects.
   *
   * @param {Validator[]} validators Array that contains Validator objects used
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
