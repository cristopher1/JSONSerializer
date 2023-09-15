import {
  SerializerHandlerSerializerTypeError,
  SerializerHandlerSerializerError,
} from '../src/SerializerHandler/Error'
import { ReplacerBuilderSerializerHandlerError } from '../src/JSONFunctionBuilder/Error'
import { ReplacerBuilder } from '../src/JSONFunctionBuilder/Replacer/ReplacerBuilder'
import { getSerializerHandler, getSerializer } from './helpers'

const filePath = 'src/JSONFunctionBuilder/Replacer/ReplacerBuilder'

const getReplacerBuilder = (serializerHandler) =>
  new ReplacerBuilder(serializerHandler)

describe(`class ReviverBuilder (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a ReplacerBuilder, when it used correct parameters', () => {
      // Arrange
      const serializerHandler = getSerializerHandler()

      // Act
      const result = () => getReplacerBuilder(serializerHandler)

      // Assert
      expect(result).not.toThrow()
    })
    describe('when the serializerHandler does not implement the expected interface', () => {
      it('Should throw a ReplacerBuilderSerializerHandlerError, when there is not an addSerializer method', () => {
        // Arrange
        const serializerHandler = {
          setSerializer: (serializer) => serializer,
        }
        const expected = ReplacerBuilderSerializerHandlerError

        // Act
        const result = () => getReplacerBuilder(serializerHandler)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should throw a ReviverBuilderSerializerHandlerError, when serializerHandler.addSerializer is not a function', () => {
        // Arrange
        const serializerHandler = {
          addSerializer: 1230,
        }
        const expected = ReplacerBuilderSerializerHandlerError

        // Act
        const result = () => getReplacerBuilder(serializerHandler)

        // Assert
        expect(result).toThrow(expected)
      })
    })
  })
  let replacerBuilder

  beforeEach(() => {
    const serializerHandler = getSerializerHandler()
    replacerBuilder = getReplacerBuilder(serializerHandler)
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

      replacerBuilder.addSerializer(serializerTypeFunction, serializerFunction)
      replacerBuilder.addSerializer(serializerTypeDate, serializerDate)

      // Act
      const result = replacerBuilder.savedSerializers

      // Assert
      expect(result).toEqual(expected)
    })
  })
  describe('(method) addSerializer', () => {
    it('Should throw a ReplacerBuilderSerializerHandlerError, when the serializerType is not a string', () => {
      // Arrange
      const serializerType = getSerializer()
      const serializer = getSerializer()
      const expected = SerializerHandlerSerializerTypeError

      // Act
      const result = () =>
        replacerBuilder.addSerializer(serializerType, serializer)

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
        replacerBuilder.addSerializer(serializerType, serializer)

        // Assert
        const result = replacerBuilder.savedSerializers
        expect(result).toEqual(expected)
      })
      it('Should throw a SerializerHandlerSerializerError, if serializer.parse is not a function', () => {
        // Arrange
        const serializerType = 'function'
        const serializer = getSerializer()
        const newSerializer = { ...getSerializer(), info: () => {} }
        const expected = {}
        expected[serializerType] = newSerializer

        replacerBuilder.addSerializer(serializerType, serializer)

        // Act
        replacerBuilder.addSerializer(serializerType, newSerializer)

        // Assert
        const result = replacerBuilder.savedSerializers
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
          replacerBuilder.addSerializer(serializerType, serializer)

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
          replacerBuilder.addSerializer(serializerType, serializer)

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
          replacerBuilder.addSerializer(serializerType, serializer)

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
          replacerBuilder.addSerializer(serializerType, serializer)

        // Assert
        expect(result).toThrow(expected)
      })
    })
  })
  describe('(method) getReplacer', () => {
    it('Should return a function', () => {
      // Arrange
      const expected = 'function'

      // Act
      const result = replacerBuilder.getReplacer()

      // Assert
      expect(typeof result).toBe(expected)
    })
  })
})
