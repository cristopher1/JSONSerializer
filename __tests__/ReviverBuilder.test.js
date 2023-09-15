import {
  SerializerHandlerSerializerTypeError,
  SerializerHandlerSerializerError,
} from '../src/SerializerHandler/Error'
import { ReviverBuilderSerializerHandlerError } from '../src/JSONFunctionBuilder/Error'
import { ReviverBuilder } from '../src/JSONFunctionBuilder/Reviver/ReviverBuilder'
import { getSerializerHandler, getSerializer } from './helpers'

const filePath = 'src/JSONFunctionBuilder/Reviver/ReviverBuilder'

const getReviverBuilder = (serializerHandler) =>
  new ReviverBuilder(serializerHandler)

describe(`class ReviverBuilder (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a ReviverBuilder, when it used correct parameters', () => {
      // Arrange
      const serializerHandler = getSerializerHandler()

      // Act
      const result = () => getReviverBuilder(serializerHandler)

      // Assert
      expect(result).not.toThrow()
    })
    describe('when the serializerHandler does not implement the expected interface', () => {
      it('Should throw a ReviverBuilderSerializerHandlerError, when there is not an addSerializer method', () => {
        // Arrange
        const serializerHandler = {
          setSerializer: (serializer) => serializer,
        }
        const expected = ReviverBuilderSerializerHandlerError

        // Act
        const result = () => getReviverBuilder(serializerHandler)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a ReviverBuilderSerializerHandlerError, when serializerHandler.addSerializer is not a function', () => {
        // Arrange
        const serializerHandler = {
          addSerializer: 1230,
        }
        const expected = ReviverBuilderSerializerHandlerError

        // Act
        const result = () => getReviverBuilder(serializerHandler)

        // Assert
        expect(result).toThrow(expected)
      })
    })
  })
  let reviverBuilder

  beforeEach(() => {
    const serializerHandler = getSerializerHandler()
    reviverBuilder = getReviverBuilder(serializerHandler)
  })

  describe('(method) savedSerializers', () => {
    it('Should return all saved serializers', () => {
      // Arrange
      const serializerTypeFunction = 'function'
      const serializerTypeDate = 'date'
      const serializerFunction = getSerializer()
      const serializerDate = getSerializer()
      const expected = {}
      expected[serializerTypeFunction] = serializerFunction
      expected[serializerTypeDate] = serializerDate

      reviverBuilder.addSerializer(serializerTypeFunction, serializerFunction)
      reviverBuilder.addSerializer(serializerTypeDate, serializerDate)

      // Act
      const result = reviverBuilder.savedSerializers

      // Assert
      expect(result).toEqual(expected)
    })
  })
  describe('(method) addSerializer', () => {
    it('Should throw a ReviverBuilderSerializerHandlerError, when the serializerType is not a string', () => {
      // Arrange
      const serializerType = getSerializer()
      const serializer = getSerializer()
      const expected = SerializerHandlerSerializerTypeError

      // Act
      const result = () =>
        reviverBuilder.addSerializer(serializerType, serializer)

      // Assert
      expect(result).toThrow(expected)
    })
    describe('when serializerType is a string', () => {
      it('Should add a new serializer', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = getSerializer()
        const expected = {}
        expected[serializerType] = serializer

        // Act
        reviverBuilder.addSerializer(serializerType, serializer)

        // Assert
        const result = reviverBuilder.savedSerializers
        expect(result).toEqual(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.parse is not a function', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = getSerializer()
        const newSerializer = { ...getSerializer(), info: () => {} }
        const expected = {}
        expected[serializerType] = newSerializer

        reviverBuilder.addSerializer(serializerType, serializer)

        // Act
        reviverBuilder.addSerializer(serializerType, newSerializer)

        // Assert
        const result = reviverBuilder.savedSerializers
        expect(result).toEqual(expected)
      })
    })
    describe('when the serializer object does not have the expected interface', () => {
      it('Should throw a SerializerHandlerSerializerError, if serializer does not contain a serialize property', () => {
        // Arrange
        const serializerType = 'date'
        const serializer = {
          parse: (value) => value,
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          reviverBuilder.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.serialize is not a function', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = {
          serialize: 'int',
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          reviverBuilder.addSerializer(serializerType, serializer)

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
          reviverBuilder.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.parse is not a function', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = {
          serialize: (value) => value,
          parse: 'int',
        }
        const expected = SerializerHandlerSerializerError

        // Act
        const result = () =>
          reviverBuilder.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
    })
  })
  describe('(method) getReviver', () => {
    it('Should return a function', () => {
      // Arrange
      const expected = 'function'

      // Act
      const result = reviverBuilder.getReviver()

      // Assert
      expect(typeof result).toBe(expected)
    })
  })
})
