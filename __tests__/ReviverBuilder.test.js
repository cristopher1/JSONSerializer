import { ReviverBuilder } from '../src/FunctionsBuilder/Reviver/ReviverBuilder'
import { getSerializer, faker } from './helpers'

/* eslint-disable no-eval */

const filePath = 'src/FunctionBuilder/Reviver/ReviverBuilder.js'

const getReviverBuilder = () => new ReviverBuilder()

describe(`class ReviverBuilder (${filePath})`, () => {
  describe('constructor', () => {
    it('Should create a ReviverBuilder using constructor without parameters', () => {
      // Act
      const result = () => getReviverBuilder()

      // Assert
      expect(result).not.toThrow()
    })
  })

  describe('(method) build', () => {
    it('Should return a function (function reviver)', () => {
      // Arrange
      const expected = 'function'
      const replacerBuilder = getReviverBuilder()

      // Act
      const result = replacerBuilder.build()

      // Assert
      expect(typeof result).toBe(expected)
    })
    describe('(function) reviver', () => {
      let reviverBuilder

      beforeEach(() => {
        reviverBuilder = getReviverBuilder()
      })
      describe('When it is created without serializers (setSerializers is not called)', () => {
        it('Should return formated data when there is not a serializer for that data', () => {
          // Arrange
          const key = 'data'
          const formatedData = {
            __typeof__: 'bigint',
            value: faker.number.bigInt().toString(),
          }
          const expected = formatedData
          const reviver = reviverBuilder.build()

          // Act
          const result = reviver(key, formatedData)

          // Assert
          expect(result).toEqual(expected)
        })
      })
      describe('When it is created with serializers (setSerializers is called)', () => {
        it('Should return formated data when there is not a serializer for that data', () => {
          // Arrange
          const serializers = {}
          const serializer = getSerializer(
            () => 'bigint',
            (value) => ({ value: `(${value.toString()})` }),
            // eslint-disable-next-line
            (serializedData) => {
              const value = serializedData.value
              return new BigInt(value)
            },
          )
          const serializerType = serializer.getSerializerType()
          serializers[serializerType] = serializer

          reviverBuilder.setSerializers(serializers)

          const key = 'data'
          const formatedData = {
            __typeof__: 'function',
            value: `(a, b) => a + b`,
          }
          const expected = formatedData
          const reviver = reviverBuilder.build()

          // Act
          const result = reviver(key, formatedData)

          // Assert
          expect(result).toBe(expected)
        })
        it('Should return unformat data when there is a serializer for that data', () => {
          // Arrange
          const serializers = {}
          const serializer = getSerializer(
            () => 'function',
            (value) => ({ value: `(${value.toString()})` }),
            (serializedData) => {
              const value = serializedData.value
              return eval(value)
            },
          )
          const serializerType = serializer.getSerializerType()
          serializers[serializerType] = serializer

          reviverBuilder.setSerializers(serializers)

          const key = 'data'
          const formatedData = {
            __typeof__: 'function',
            value: '((a, b) => a + b)',
          }
          const expected = (a, b) => a + b
          const reviver = reviverBuilder.build()

          // Act
          const result = reviver(key, formatedData)

          // Assert
          for (let i = 0; i < 5; i++) {
            const a = faker.number.int()
            const b = faker.number.int()
            expect(result(a, b)).toBe(expected(a, b))
          }
        })
      })
    })
  })
})
