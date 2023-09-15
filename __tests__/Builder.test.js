import { BuilderAbstractClassError } from '../src/JSONFunctionBuilder/Error'
import { Builder } from '../src/JSONFunctionBuilder/Builder'

const filePath = 'src/JSONFunctionBuilder/Builder.js'

describe(`class Builder (${filePath})`, () => {
  describe('constructor', () => {
    it('Should throw a BuilderAbstractClassError, when it is called its constructor', () => {
      // Arrange
      const serializerHandler = { addSerializer: () => {} }
      const ErrorBuilder = Error
      const expected = BuilderAbstractClassError

      // Act
      const result = () => new Builder(serializerHandler, ErrorBuilder)

      // Assert
      expect(result).toThrow(expected)
    })
  })
})
