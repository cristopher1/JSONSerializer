export class InvalidTypeError extends Error {
  /** @param {string} message The Error's message. */
  constructor(message) {
    super(message)
    this.name = 'Invalid Type'
  }
}

export class DoesNotContainPropertyError extends Error {
  /** @param {string} message The Error's message. */
  constructor(message) {
    super(message)
    this.name = 'Does not contain property'
  }
}
