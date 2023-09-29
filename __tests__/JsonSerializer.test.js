import { faker, getSerializer } from './helpers'
import { ValidatorError } from '../src/Validator/Error'
import { JsonSerializer } from '../src/core/JsonSerializer'
import { buildJsonSerializer } from '../src'

/* eslint-disable no-eval */
const filePath = 'src/index.js'

describe(`export function buildJsonSerializer (${filePath})`, () => {
  it('Should return a JsonSerializer object', () => {
    // Arrange
    const expected = JsonSerializer

    // Act
    const result = buildJsonSerializer()

    // Assert
    expect(result).toBeInstanceOf(expected)
  })
  describe('class JsonSerializer', () => {
    let jsonSerializer

    beforeEach(() => {
      jsonSerializer = buildJsonSerializer()
    })
    describe('(method) installSerializersAndRefreshJsonSerializer', () => {
      it('Should throw a ValidatorError when some serializer is invalid', () => {
        // Arrange
        const serializerInstaller = {
          install: (serializerHandler, installOptions) => {
            const serializer = getSerializer(() => 'function')
            serializerHandler.addSerializer(serializer)
          },
        }
        const expected = ValidatorError

        // Act
        const result = () =>
          jsonSerializer.installSerializersAndRefreshJsonSerializer(
            serializerInstaller,
          )

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should add serializers using default installOptions parameter', () => {
        // Arrange
        const getSerializerInstaller = (serializer) => ({
          install: (serializerHandler, installOptions) => {
            serializerHandler.addSerializer(serializer)
          },
        })
        const serializer = getSerializer(
          () => 'function',
          (value) => value.toString(),
          (value) => value,
        )
        const serializerInstaller = getSerializerInstaller(serializer)
        const expected = {
          function: serializer,
        }

        // Act
        jsonSerializer.installSerializersAndRefreshJsonSerializer(
          serializerInstaller,
        )

        // Assert
        const result = jsonSerializer.getSerializers()
        expect(result).toEqual(expected)
      })
      it('Should add serializers passing an object with install configuration through installOptions parameter', () => {
        // Arrange
        const getSerializerInstaller = (serializers) => ({
          install: (serializerHandler, installOptions) => {
            const options = {
              withFunctionSerializer: true,
              ...installOptions,
            }
            const { withFunctionSerializer } = options
            for (const serializer of serializers) {
              const serializerType = serializer.getSerializerType()
              if (serializerType !== 'function' || withFunctionSerializer) {
                serializerHandler.addSerializer(serializer)
              }
            }
          },
        })
        const functionSerializer = getSerializer(
          () => 'function',
          (value) => value.toString(),
          (value) => value,
        )
        const dateSerializer = getSerializer(
          () => 'date',
          (value) => value.toString(),
          (value) => value,
        )
        const serializerInstaller = getSerializerInstaller([
          functionSerializer,
          dateSerializer,
        ])
        const expected = {
          date: dateSerializer,
        }

        // Act
        jsonSerializer.installSerializersAndRefreshJsonSerializer(
          serializerInstaller,
          { withFunctionSerializer: false },
        )

        // Assert
        const result = jsonSerializer.getSerializers()
        expect(result).toEqual(expected)
      })
    })
    describe('(method) addSerializerAndRefreshJsonSerializer', () => {
      it('Should throw a ValidatorError when the serializer is invalid', () => {
        // Arrange
        const expected = ValidatorError
        const serializer = getSerializer(() => 'function')

        // Act
        const result = () =>
          jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

        // Assert
        expect(result).toThrow(expected)
      })
      it('Should add serializers when they are valid', () => {
        // Arrange
        const functionSerializer = getSerializer(
          () => 'function',
          (value) => value.toString(),
          (value) => value,
        )
        const dateSerializer = getSerializer(
          () => 'date',
          (value) => value.toString(),
          (value) => value,
        )
        const expected = {
          function: functionSerializer,
          date: dateSerializer,
        }

        // Act
        jsonSerializer.addSerializerAndRefreshJsonSerializer(functionSerializer)
        jsonSerializer.addSerializerAndRefreshJsonSerializer(dateSerializer)

        // Assert
        const result = jsonSerializer.getSerializers()

        expect(result).toEqual(expected)
      })
    })
    describe('(method) getSerializers', () => {
      it('Should return an empty object when jsonSerializer does not contain serializers', () => {
        // Arrange
        const expected = {}

        // Act
        const result = jsonSerializer.getSerializers()

        // Assert
        expect(result).toEqual(expected)
      })
      it('Should return serializers when jsonSerializer contains serializers', () => {
        // Arrange
        const functionSerializer = getSerializer(
          () => 'function',
          (value) => value.toString(),
          (value) => value,
        )
        const dateSerializer = getSerializer(
          () => 'date',
          (value) => value.toString(),
          (value) => value,
        )
        const expected = {
          function: functionSerializer,
          date: dateSerializer,
        }

        jsonSerializer.addSerializerAndRefreshJsonSerializer(functionSerializer)
        jsonSerializer.addSerializerAndRefreshJsonSerializer(dateSerializer)

        // Act
        const result = jsonSerializer.getSerializers()

        // Assert
        expect(result).toEqual(expected)
      })
    })
    describe('(method) serialize', () => {
      describe('When there are not serializers', () => {
        it('Should return a serialized data using default JSON.stringify', () => {
          // Arrange
          const unserializedData = faker.string.sample()
          const expected = `"${unserializedData}"`

          // Act
          const result = jsonSerializer.serialize(unserializedData)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('When there are serializers', () => {
        it('Should return a serialized data when there is a serializer for that data and its typeof is different from object', () => {
          // Arrange
          const unserializedData = faker.number.bigInt()
          const serializer = getSerializer(
            () => 'bigint',
            (unserializerData) => ({ value: unserializerData.toString() }),
            (serializedData) => {
              const { value } = serializedData
              return BigInt(value)
            },
          )
          const expected = `{"__typeof__":"bigint","value":"${unserializedData.toString()}"}`

          jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

          // Act
          const result = jsonSerializer.serialize(unserializedData)

          // Assert
          expect(result).toBe(expected)
        })
        it('Should return a serialized data when there is a serializer for that data and its typeof is object', () => {
          // Arrange
          class MyObject {
            constructor(data1) {
              this.data1 = data1
            }

            toString() {
              return `({ data1: ${this.data1}})`
            }
          }
          const unserializedData = new MyObject('string')
          const serializer = getSerializer(
            () => 'MyObject',
            (unserializerData) => ({ value: unserializerData.toString() }),
            (serializedData) => {
              const { value } = serializedData
              const parameters = Object.values(eval(value))
              return new MyObject(...parameters)
            },
          )
          const expected = `{"__typeof__":"MyObject","value":"${unserializedData.toString()}"}`

          jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

          // Act
          const result = jsonSerializer.serialize(unserializedData)

          // Assert
          expect(result).toBe(expected)
        })
        it('Should not return a serialized data when there is not a serializer for that data and JSON.stringify can not process it', () => {
          // Arrange
          const unserializedData = () => {}
          const serializer = getSerializer(
            () => 'bigint',
            (unserializerData) => ({ value: unserializerData.toString() }),
            (serializedData) => {
              const { value } = serializedData
              return BigInt(value)
            },
          )
          const expected = undefined

          jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

          // Act
          const result = jsonSerializer.serialize(unserializedData)

          // Assert
          expect(result).toBe(expected)
        })
      })
      describe('(method) parse', () => {
        describe('When there are not serializers', () => {
          it('Should return unserialized data using default JSON.parse', () => {
            // Arrange
            const unserializedData = faker.string.sample()
            const serializedData = `"${unserializedData}"`
            const expected = unserializedData

            // Act
            const result = jsonSerializer.parse(serializedData)

            // Assert
            expect(result).toBe(expected)
          })
        })
        describe('When there are serializers', () => {
          it('Should return unserialized data when there is a serializer for that data and its typeof is different from object', () => {
            // Arrange
            const unserializedData = faker.number.bigInt()
            const serializer = getSerializer(
              () => 'bigint',
              (unserializerData) => ({ value: unserializerData.toString() }),
              (serializedData) => {
                const { value } = serializedData
                return BigInt(value)
              },
            )

            jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

            const serializedData = jsonSerializer.serialize(unserializedData)
            const expected = unserializedData

            // Act
            const result = jsonSerializer.parse(serializedData)

            // Assert
            expect(result).toBe(expected)
          })
          it('Should return unserialized data when there is a serializer for that data and its typeof is object', () => {
            // Arrange
            class NewObject {
              #data3

              constructor(data1, data2, data3) {
                this.data1 = data1
                this.data2 = data2
                this.#data3 = data3
              }

              getData1() {
                return this.data1
              }

              getData2() {
                return this.data2
              }

              getData3() {
                return this.#data3
              }

              toString() {
                return `(
                  { 
                    data1: "${this.data1}",
                    data2: [${this.data2}],
                    data3: "${this.#data3}"
                  }
                )`
              }
            }
            const unserializedData = new NewObject(
              'string',
              [1, 2, 3],
              'lalalalal',
            )
            const serializer = getSerializer(
              () => 'NewObject',
              (unserializerData) => ({ value: unserializerData.toString() }),
              (serializedData) => {
                const { value } = serializedData
                const parameters = Object.values(eval(value))
                return new NewObject(...parameters)
              },
            )

            jsonSerializer.addSerializerAndRefreshJsonSerializer(serializer)

            const serializedData = jsonSerializer.serialize(unserializedData)
            const expected = unserializedData

            // Act
            const result = jsonSerializer.parse(serializedData)

            // Assert
            expect(result.getData1()).toBe(expected.getData1())
            expect(result.getData2()).toEqual(expected.getData2())
            expect(result.getData3()).toBe(expected.getData3())
          })
        })
      })
    })
  })
})
