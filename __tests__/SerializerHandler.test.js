import { ValidatorHandler } from '../src/ValidatorHandler/ValidatorHandler'
import { PropertyContainsValidTypeValidator } from '../src/Validator/PropertyContainsValidTypeValidator'
import { ContainsPropertyValidator } from '../src/Validator/ContainsPropertyValidator'
import { IsTypeValidator } from '../src/Validator/IsTypeValidator'
import { ValidatorError } from '../src/Validator/Error'
import { getSerializer, getSerializerHandler } from './helpers'

const filePath = 'src/SerializerHandler/SerializerHandler.js'

describe(`class SerializerHandler (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a SerializerHandler using constructor without parameters', () => {
      // Act
      const result = () => getSerializerHandler()

      // Assert
      expect(result).not.toThrow()
    })
    it('Should create a SerializerHandler using constructor with a ValidatorHandler object', () => {
      // Arrage
      const validators = []
      const serializerValidatorHandler = new ValidatorHandler(validators)

      // Act
      const result = () => getSerializerHandler(serializerValidatorHandler)

      // Assert
      expect(result).not.toThrow()
    })
  })
  describe('(method) getSerializers', () => {
    it('Should return an empty object when there is not saved serializers', () => {
      // Arrange
      const expected = {}
      const serializerHandler = getSerializerHandler()

      // Act
      const result = serializerHandler.getSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
    it('Should return an object with the saved serializers', () => {
      // Arrange
      const functionSerializer = getSerializer(
        () => 'function',
        (value) => value.toString(),
        (value) => value,
      )
      const expected = {
        function: functionSerializer,
      }
      const serializerHandler = getSerializerHandler()
      serializerHandler.addSerializer(functionSerializer)

      // Act
      const result = serializerHandler.getSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
  })
  describe('(method) addSerializer', () => {
    it('Should add serializers when there are not validators', () => {
      // Arrange
      const functionSerializer = getSerializer(
        () => 'function',
        (value) => value.toString(),
        (value) => value,
      )
      const bigIntSerializer = getSerializer(
        () => 'bigint',
        (value) => value.toString(),
        (value) => value,
      )
      const expected = {
        function: functionSerializer,
        bigint: bigIntSerializer,
      }
      const serializerHandler = getSerializerHandler()

      // Act
      serializerHandler.addSerializer(functionSerializer)
      serializerHandler.addSerializer(bigIntSerializer)

      // Assert
      const result = serializerHandler.getSerializers()
      expect(result).toEqual(expected)
    })
    it('Should not add serializers when they do not pass the validation', () => {
      // Arrange
      const expected = ValidatorError

      const serializerValidators = [
        new PropertyContainsValidTypeValidator(
          new ContainsPropertyValidator('getSerializerType'),
          new IsTypeValidator('function'),
        ),
        new PropertyContainsValidTypeValidator(
          new ContainsPropertyValidator('serialize'),
          new IsTypeValidator('function'),
        ),
        new PropertyContainsValidTypeValidator(
          new ContainsPropertyValidator('parse'),
          new IsTypeValidator('function'),
        ),
      ]
      const validatorHandler = new ValidatorHandler(serializerValidators)
      const serializerHandler = getSerializerHandler(validatorHandler)

      const serializer = getSerializer(
        () => 'function',
        (value) => value.toString(),
      )

      // Act
      const result = () => serializerHandler.addSerializer(serializer)

      // Assert
      expect(result).toThrow(expected)
    })
  })
})
