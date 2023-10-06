import { ValidatorError } from '../../src/Validators/Error'
import { faker } from '../helpers'

const filePath = 'src/Validators/Error.js'

describe(`class ValidatorError (${filePath})`, () => {
  describe('(property) name', () => {
    it('Should return a string with the name passed in the constructor', () => {
      // Arrange
      const name = faker.string.nanoid()
      const message = faker.string.sample()
      const validatorError = new ValidatorError(name, message)
      const expected = name

      // Act
      const result = validatorError.name

      // Assert
      expect(result).toBe(expected)
    })
  })
  describe('(property) message', () => {
    it('Should return a string with the message passed in the constructor', () => {
      // Arrange
      const name = faker.string.nanoid()
      const message = faker.string.sample()
      const validatorError = new ValidatorError(name, message)
      const expected = message

      // Act
      const result = validatorError.message

      // Assert
      expect(result).toBe(expected)
    })
  })
})
