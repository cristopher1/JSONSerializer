/** @interface */
export class Validator {
  /**
   * Validates the data. If they are invalid an Error is thrown.
   *
   * @param {any} data The data to validate.
   */
  validate(data) {}
}
