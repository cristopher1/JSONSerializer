import { faker, getSerializer } from './helpers'
import { ValidatorError } from '../src/Validator/Error'
import { JsonSerializer } from '../src/core/JsonSerializer'
import { buildJsonSerializer } from '../src'

class AirplaneTestClass {
  #model

  constructor(model) {
    this.#model = model
  }

  getModel() {
    return this.#model
  }

  getObjectLiteral() {
    return {
      model: this.#model,
    }
  }
}

class WheelTestClass {
  #duration

  constructor(duration) {
    this.#duration = duration
  }

  getDuration() {
    return this.#duration
  }

  getObjectLiteral() {
    return {
      duration: this.#duration,
    }
  }
}

class TransportVehicleTestClass {
  #wheels

  constructor(wheels) {
    this.#wheels = wheels
  }

  getWheels() {
    return [...this.#wheels]
  }

  getObjectLiteral() {
    return {
      wheels: this.#wheels,
    }
  }
}

class AirportTestClass {
  #transportVehicles
  #airplanes

  constructor(transportVehicles, airplanes) {
    this.#transportVehicles = transportVehicles
    this.#airplanes = airplanes
  }

  getTransportVehicles() {
    return [...this.#transportVehicles]
  }

  getAirplanes() {
    return [...this.#airplanes]
  }

  getObjectLiteral() {
    return {
      transportVehicles: this.#transportVehicles,
      airplanes: this.#airplanes,
    }
  }
}

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
          const model = faker.string.sample()
          const unserializedData = new AirplaneTestClass(model)

          const serializer = getSerializer(
            () => 'AirplaneTestClass',
            (unserializedData) => ({
              value: unserializedData.getObjectLiteral(),
            }),
            (serializedData) => {
              const { value } = serializedData
              const parameters = Object.values(value)
              return new AirplaneTestClass(...parameters)
            },
          )

          const __typeof__ = serializer.getSerializerType()
          const expected = `{"__typeof__":"${__typeof__}","value":{"model":"${model}"}}`

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
            const transportVehicles = [
              new TransportVehicleTestClass([
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
              ]),
              new TransportVehicleTestClass([
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
              ]),
              new TransportVehicleTestClass([
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
                new WheelTestClass(faker.number.int()),
              ]),
            ]

            const airplanes = [
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
              new AirplaneTestClass(faker.string.sample()),
            ]

            const unserializedData = new AirportTestClass(
              transportVehicles,
              airplanes,
            )

            const airportTestClassSerializer = getSerializer(
              () => 'AirportTestClass',
              (unserializerData) => ({
                value: unserializerData.getObjectLiteral(),
              }),
              (serializedData) => {
                const { value } = serializedData
                const parameters = Object.values(value)
                return new AirportTestClass(...parameters)
              },
            )

            const airplaneTestClassSerializer = getSerializer(
              () => 'AirplaneTestClass',
              (unserializerData) => ({
                value: unserializerData.getObjectLiteral(),
              }),
              (serializedData) => {
                const { value } = serializedData
                const parameters = Object.values(value)
                return new AirplaneTestClass(...parameters)
              },
            )

            const transportVehicleTestClassSerializer = getSerializer(
              () => 'TransportVehicleTestClass',
              (unserializerData) => ({
                value: unserializerData.getObjectLiteral(),
              }),
              (serializedData) => {
                const { value } = serializedData
                const parameters = Object.values(value)
                return new TransportVehicleTestClass(...parameters)
              },
            )

            const wheelTestClassSerializer = getSerializer(
              () => 'WheelTestClass',
              (unserializerData) => ({
                value: unserializerData.getObjectLiteral(),
              }),
              (serializedData) => {
                const { value } = serializedData
                const parameters = Object.values(value)
                return new WheelTestClass(...parameters)
              },
            )

            jsonSerializer.addSerializerAndRefreshJsonSerializer(
              airportTestClassSerializer,
            )
            jsonSerializer.addSerializerAndRefreshJsonSerializer(
              airplaneTestClassSerializer,
            )
            jsonSerializer.addSerializerAndRefreshJsonSerializer(
              transportVehicleTestClassSerializer,
            )
            jsonSerializer.addSerializerAndRefreshJsonSerializer(
              wheelTestClassSerializer,
            )

            const serializedData = jsonSerializer.serialize(unserializedData)
            const expected = unserializedData

            // Act
            const result = jsonSerializer.parse(serializedData)

            // Assert
            // AirportTestClass
            expect(result.getAirplanes()).toEqual(expected.getAirplanes())
            expect(result.getTransportVehicles()).toEqual(
              expected.getTransportVehicles(),
            )

            // AirplaneTestClass
            const resultAirplanes = result.getAirplanes()
            const expectedAirplanes = expected.getAirplanes()
            for (let i = 0; i < resultAirplanes.length; i++) {
              expect(resultAirplanes[i].getModel()).toBe(
                expectedAirplanes[i].getModel(),
              )
            }
            // TransportVehicleTestClass
            const resultTransportVehicles = result.getTransportVehicles()
            const expectedTransportVehicles = expected.getTransportVehicles()
            for (let i = 0; i < resultTransportVehicles.length; i++) {
              expect(resultTransportVehicles[i].getWheels()).toEqual(
                expectedTransportVehicles[i].getWheels(),
              )
              // WheelTestClass
              const resultWheels = resultTransportVehicles[i].getWheels()
              const expectedWheels = expectedTransportVehicles[i].getWheels()
              for (let j = 0; j < resultWheels.length; j++) {
                expect(resultWheels[j].getDuration()).toBe(
                  expectedWheels[j].getDuration(),
                )
              }
            }
          })
        })
      })
    })
  })
})
