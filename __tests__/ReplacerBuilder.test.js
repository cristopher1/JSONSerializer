import { ReplacerBuilder } from '../src/JsonFunctionBuilder/Replacer/ReplacerBuilder'
import { getSerializer, faker } from './helpers'

const filePath = 'src/JsonFunctionBuilder/Replacer/ReplacerBuilder.js'

const getReplacerBuilder = () => new ReplacerBuilder()

describe(`class ReplacerBuilder (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a ReplacerBuilder using constructor without parameters', () => {
      // Act
      const result = () => getReplacerBuilder()

      // Assert
      expect(result).not.toThrow()
    })
  })

  describe('(method) build', () => {
    it('Should return a function (function replacer)', () => {
      // Arrange
      const expected = 'function'
      const replacerBuilder = getReplacerBuilder()

      // Act
      const result = replacerBuilder.build()

      // Assert
      expect(typeof result).toBe(expected)
    })
    describe('(function) replacer', () => {
      let replacerBuilder
      let completeObjectToFormat

      beforeEach(() => {
        replacerBuilder = getReplacerBuilder()
        completeObjectToFormat = {}
      })
      describe('When it is created without serializers (setSerializers is not called)', () => {
        it('Should return unformated data when there is not a serializer for that data', () => {
          // Arrange
          const key = 'data'
          const unformatedData = () => {}
          completeObjectToFormat[key] = unformatedData
          const expected = unformatedData
          const replacer = replacerBuilder.build()

          // Act
          const result = replacer.call(
            completeObjectToFormat,
            key,
            unformatedData,
          )

          // Assert
          expect(result).toEqual(expected)
        })
      })
      describe('When it is created with serializers (setSerializers is called)', () => {
        it('Should return unformated data when there is not a serializer for that data', () => {
          // Arrange
          const serializers = {}
          const serializer = getSerializer(
            () => 'function',
            (value) => ({ value: `(${value.toString()})` }),
            // eslint-disable-next-line
            (serializedData) => eval(serializedData),
          )
          const serializerType = serializer.getSerializerType()
          serializers[serializerType] = serializer

          replacerBuilder.setSerializers(serializers)

          const key = 'data'
          const unformatedData = faker.number.bigInt()
          completeObjectToFormat[key] = unformatedData
          const expected = unformatedData
          const replacer = replacerBuilder.build()

          // Act
          const result = replacer.call(
            completeObjectToFormat,
            key,
            unformatedData,
          )

          // Assert
          expect(result).toEqual(expected)
        })
        it('Should return formated data when there is a serializer for that data', () => {
          // Arrange
          const serializers = {}
          const serializer = getSerializer(
            () => 'bigint',
            (value) => ({ value: `${value.toString()}` }),
            // eslint-disable-next-line
            (serializedData) => {
              const value = serializedData.value
              return new BigInt(value)
            },
          )
          const serializerType = serializer.getSerializerType()
          serializers[serializerType] = serializer

          replacerBuilder.setSerializers(serializers)

          const key = 'data'
          const unformatedData = faker.number.bigInt()
          completeObjectToFormat[key] = unformatedData
          const expected = {
            __typeof__: 'bigint',
            value: unformatedData.toString(),
          }
          const replacer = replacerBuilder.build()

          // Act
          const result = replacer.call(
            completeObjectToFormat,
            key,
            unformatedData,
          )

          // Assert
          expect(result).toEqual(expected)
        })
      })
    })
  })
})
