export class ValidatorError extends Error {
  constructor(name, message) {
    super(message)
    super.name = name
  }

  getName() {
    return super.name
  }
}
