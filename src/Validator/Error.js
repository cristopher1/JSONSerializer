export class ValidatorError extends Error {
  /**
   * Error throws by Validator class.
   *
   * @param {string} name The Error's name.
   * @param {string} message The Error's message.
   */
  constructor(name, message) {
    super(message)
    this.name = name
  }
}
