export class ValidatorError extends Error {
  constructor(name, message) {
    super(message)
    this.name = name
  }
}
