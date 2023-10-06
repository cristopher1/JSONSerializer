import { ContainsPropertyValidator } from '../../src/Validators/ContainsPropertyValidator'
import { DoesNotContainPropertyError } from '../../src/Validators/Error'
import { faker } from '../helpers'

const filePath = 'src/Validators/ContainsPropertyValidator.js'

describe(`class ContainsPropertyValidator (${filePath})`, () => {
  describe('(method) getRequiredPropertyName', () => {
    it('Should return a string with the required property name passed in the constructor', () => {
      // Arrange
      const expected = faker.animal.fish()
      const validator = new ContainsPropertyValidator(expected)

      // Act
      const result = validator.getRequiredPropertyName()

      // Assert
      expect(result).toBe(expected)
    })
  })
  describe('(method) validate', () => {
    it('Should throw a DoesNotContainPropertyError when the data does not contain the required property', () => {
      // Arrange
      const data = {
        function: () => {},
      }
      const validator = new ContainsPropertyValidator('serializer')
      const expected = DoesNotContainPropertyError

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should not throw a ValidatorError when the data contains the required property', () => {
      // Arrange
      const data = {
        keyWithData: faker.animal.bear(),
      }
      const validator = new ContainsPropertyValidator('keyWithData')

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).not.toThrow()
    })
  })
})
