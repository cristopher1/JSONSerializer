export class ValidatorError extends Error {
  #name

  constructor(name, message) {
    super(message)
    this.#name = name
  }

  getName() {
    return this.#name
  }
}
