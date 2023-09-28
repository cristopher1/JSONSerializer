import { getSerializer } from './helpers'
import { ValidatorError } from '../src/Validator/Error'
import { JsonSerializer } from '../src/core/JsonSerializer'
import { buildJsonSerializer } from '../src'

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
  })
})
