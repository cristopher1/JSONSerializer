import { ContainsPropertyValidator } from '../../src/Validators/ContainsPropertyValidator'
import { IsTypeValidator } from '../../src/Validators/IsTypeValidator'
import { PropertyContainsValidTypeValidator } from '../../src/Validators/PropertyContainsValidTypeValidator'
import { ValidatorError } from '../../src/Validators/Error'
import { faker } from '../helpers'

const filePath = 'src/Validator/PropertyContainsValidTypeValidator.js'

describe(`class PropertyContainsValidTypeValidator (${filePath})`, () => {
  describe('(method) validate', () => {
    it('Should throw a ValidatorError when the data does not contain the required property', () => {
      // Arrange
      const data = {
        function: () => {},
      }
      const validator = new PropertyContainsValidTypeValidator(
        new ContainsPropertyValidator('serialize'),
        new IsTypeValidator('function'),
      )
      const expected = ValidatorError

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should throw a ValidatorError when the property value is not the required type', () => {
      // Arrange
      const data = {
        data: faker.string.nanoid(),
      }
      const validator = new PropertyContainsValidTypeValidator(
        new ContainsPropertyValidator('data'),
        new IsTypeValidator('bigint'),
      )
      const expected = ValidatorError

      // Act
      const result = () => validator.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should not throw a ValidatorError when the data contains the required property and the property value is of the required type', () => {
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
