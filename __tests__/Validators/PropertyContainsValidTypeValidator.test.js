import { ContainsPropertyValidator } from '../../src/validators/ContainsPropertyValidator'
import { IsTypeValidator } from '../../src/validators/IsTypeValidator'
import { PropertyContainsValidTypeValidator } from '../../src/validators/PropertyContainsValidTypeValidator'
import {
  InvalidTypeError,
  DoesNotContainPropertyError,
} from '../../src/validators/Error'
import { faker } from '../helpers'

const filePath = 'src/validators/PropertyContainsValidTypeValidator.js'

describe(`class PropertyContainsValidTypeValidator (${filePath})`, () => {
  describe('(method) validate', () => {
    it('Should throw a DoesNotContainPropertyError when the data does not contain the required property', () => {
      // Arrange
      const data = {
        function: () => {},
      }
      const validator = new PropertyContainsValidTypeValidator(
        new ContainsPropertyValidator('serialize'),
        new IsTypeValidator('function'),
      )
      const expected = DoesNotContainPropertyError

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should throw a InvalidTypeError when the property value is not the required type', () => {
      // Arrange
      const data = {
        data: faker.string.nanoid(),
      }
      const validator = new PropertyContainsValidTypeValidator(
        new ContainsPropertyValidator('data'),
        new IsTypeValidator('bigint'),
      )
      const expected = InvalidTypeError

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should not throw an Error when the data contains the required property and the property value is of the required type', () => {
      // Arrange
      const data = {
        keyWithData: faker.animal.bear(),
      }
      const validator = new PropertyContainsValidTypeValidator(
        new ContainsPropertyValidator('keyWithData'),
        new IsTypeValidator('string'),
      )

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).not.toThrow()
    })
  })
})
