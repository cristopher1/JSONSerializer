import { ValidatorThrowError } from './ValidatorThrowError'

export class ContainsPropertyValidator extends ValidatorThrowError {
  #requiredPropertyName

  constructor(requiredPropertyName) {
    super('Property not found')
    this.#requiredPropertyName = requiredPropertyName
  }

  getRequiredPropertyName() {
    return this.#requiredPropertyName
  }

  validate(data) {
    const requiredPropertyName = this.#requiredPropertyName

    if (!(requiredPropertyName in data)) {
      const errorDescription = `Does not exist the property ${requiredPropertyName}`
      super.throwError(data, errorDescription)
    }
  }
}
