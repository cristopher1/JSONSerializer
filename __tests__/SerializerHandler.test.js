import {
  SerializerHandlerSerializerTypeError,
  SerializerHandlerSerializerError,
} from '../src/SerializerHandler/Error'
import { getSerializerHandler, getSerializer } from './helpers'

const filePath = 'src/SerializerHandler/SerializerHandler.js'

describe(`class SerializerHandler (${filePath})`, () => {
  describe('constructor', () => {
    it('Should not throw any Error, when the constructor is called', () => {
      // Act
      const result = () => getSerializerHandler()

      // Arrange
      expect(result).not.toThrow()
    })
  })
  let serializerHandler

  beforeEach(() => {
    serializerHandler = getSerializerHandler()
  })
  describe('(getter) serializers', () => {
    it('Should return an empty object, when there is not serializers saved', () => {
      // Arrange
      const expected = {}

      // Act
      const result = serializerHandler.getSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
    it('Should return a object that contains the serializers, when there is serializers saved', () => {
      // Arrange
      const serializerTypeFunction = 'function'
      const serializerTypeDate = 'date'
      const serializerFunction = getSerializer()
      const serializerDate = getSerializer()
      const expected = {}
      expected[serializerTypeFunction] = serializerFunction
      expected[serializerTypeDate] = serializerDate

      serializerHandler.addSerializer(
        serializerTypeFunction,
        serializerFunction,
      )
      serializerHandler.addSerializer(serializerTypeDate, serializerDate)

      // Act
      const result = serializerHandler.getSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
  })
  describe('(getter) savedSerializers', () => {
    it('Should return an empty object, when there is not serializers saved', () => {
      // Arrange
      const expected = {}

      // Act
      const result = serializerHandler.getSavedSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
    it('Should return a object that contains the serializers, when there is serializers saved', () => {
      // Assert
      const serializerTypeFunction = 'function'
      const serializerTypeDate = 'date'
      const serializerFunction = getSerializer()
      const serializerDate = getSerializer()
      const expected = {}
      expected[serializerTypeFunction] = serializerFunction
      expected[serializerTypeDate] = serializerDate

      serializerHandler.addSerializer(
        serializerTypeFunction,
        serializerFunction,
      )
      serializerHandler.addSerializer(serializerTypeDate, serializerDate)

      // Act
      const result = serializerHandler.getSavedSerializers()

      // Assert
      expect(result).toEqual(expected)
    })
  })
  describe('(method) addSerializer', () => {
    it('Should throw a SerializerHandlerSerializerTypeError, if serializerType is not an String', () => {
      // Arrange
      const serializerType = {}
      const serializer = getSerializer()
      const expected = SerializerHandlerSerializerTypeError

      // Act
      const result = () =>
        serializerHandler.addSerializer(serializerType, serializer)

      // Assert
      expect(result).toThrow(expected)
    })
    describe('when serializerType is a string', () => {
      it('Should add a new serializer', () => {
        // Arrange
        const serializerType = 'function'
        const expected = getSerializer()

        // Act
        serializerHandler.addSerializer(serializerType, expected)

        // Assert
        const serializers = serializerHandler.getSerializers()
        const result = serializers[serializerType]

        expect(result).toEqual(expected)
      })
      it('Should override a serializer, when to use the same serializerType', () => {
        // Arrange
        const serializerType = 'date'
        const expected = getSerializer()
        const serializer = { ...expected, getKey: (value) => value }

        serializerHandler.addSerializer(serializerType, serializer)

        // Act
        serializerHandler.addSerializer(serializerType, expected)

        // Assert
        const serializers = serializerHandler.getSerializers()
        const result = serializers[serializerType]

        expect(result).toEqual(expected)
      })
    })
    describe('when the serializer object does not have the expected interface', () => {
      it('Should throw a SerializerHandlerSerializerError, if serializer does not contain a serialize property', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = {
          parse: (value) => value,
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          serializerHandler.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.serialize is not a function', () => {
        // Arrange
        const serializerType = 'date'
        const serializer = {
          serialize: {},
          parse: (value) => ({ value }),
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          serializerHandler.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer does not contain a parse property', () => {
        // Arrange
        const serializerType = 'date'
        const serializer = {
          serialize: (value) => value,
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          serializerHandler.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.parse is not a function', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = {
          serialize: (value) => value,
          parse: [1, 2, 3, 4, 5, 6, 7],
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          serializerHandler.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
    })
  })
})
