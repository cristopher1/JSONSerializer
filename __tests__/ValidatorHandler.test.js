import { ContainsPropertyValidator } from '../src/Validators/ContainsPropertyValidator'
import { ValidatorHandler } from '../src/Validators/Handler/ValidatorHandler'
import { ValidatorError } from '../src/Validators/Error'
import { faker } from './helpers'
import { IsTypeValidator } from '../src/Validators/IsTypeValidator'

const filePath = 'src/Validators/Handler/ValidatorHandler.js'

describe(`class ValidatorHandler (${filePath})`, () => {
  describe('(method) validate', () => {
    it('Should throw a ValidatorError when the data is invalid', () => {
      // Arrange
      const data = {
        function: () => {},
      }
      const validators = [new ContainsPropertyValidator('serializer')]
      const validatorHandler = new ValidatorHandler(validators)
      const expected = ValidatorError

      // Act
      const result = () => validatorHandler.validate(data)

      // Assert
      expect(result).toThrow(expected)
    })
    it('Should throw an Error when the ValidatorHandler does not have validators', () => {
      // Arrange
      const data = {
        keyWithData: faker.animal.bear(),
      }
      const validatorHandler = new ValidatorHandler()

      // Act
      const result = () => validatorHandler.validate(data)

      // Assert
      expect(result).toThrow()
    })
    it('Should not throw a ValidatorError when the data is valid', () => {
      // Arrange
      const data = {
        keyWithData: faker.animal.bear(),
      }
      const validators = [
        new ContainsPropertyValidator('keyWithData'),
        new IsTypeValidator('object'),
      ]
      const validatorHandler = new ValidatorHandler(validators)

      // Act
      const result = () => validatorHandler.validate(data)

      // Assert
      expect(result).not.toThrow()
    })
  })
})
