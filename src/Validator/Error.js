export class ValidatorError extends Error {
  /**
   * @param {string} name The error's name.
   * @param {string} message The error's message.
   */
  constructor(name, message) {
    super(message)
    this.name = name
  }
}
