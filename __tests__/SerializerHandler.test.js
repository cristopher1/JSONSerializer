import { ValidatorHandler } from '../src/Validators/Handler/ValidatorHandler'
import { PropertyContainsValidTypeValidator } from '../src/Validators/PropertyContainsValidTypeValidator'
import { ContainsPropertyValidator } from '../src/Validators/ContainsPropertyValidator'
import { IsTypeValidator } from '../src/Validators/IsTypeValidator'
import { ValidatorError } from '../src/Validators/Error'
import { getSerializer, getSerializerHandler } from './helpers'

const filePath = 'src/Serializers/Handler/SerializerHandler.js'

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
    describe('When SerializerHandler does not have validators', () => {
      it('Should add serializers', () => {
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
    })
    describe('When SerializerHandler has validators', () => {
      let serializerHandler

      beforeEach(() => {
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
        serializerHandler = getSerializerHandler(validatorHandler)
      })
      it('Should add serializers when they are valid', () => {
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

        // Act
        serializerHandler.addSerializer(functionSerializer)
        serializerHandler.addSerializer(bigIntSerializer)

        // Assert
        const result = serializerHandler.getSerializers()
        expect(result).toEqual(expected)
      })
      it('Should not add serializers when they are invalid', () => {
        // Arrange
        const expected = ValidatorError

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
})
