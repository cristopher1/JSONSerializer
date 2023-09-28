export class ValidatorHandler {
  #validators

  constructor(validators = []) {
    this.#validators = validators
  }

  validate(data) {
    const validators = this.#validators
    for (const validator of validators) {
      validator.validate(data)
    }
  }
}
