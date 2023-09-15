import { ReplacerBuilder } from '../src/JSONFunctionBuilder/Replacer/ReplacerBuilder'
import { ReviverBuilder } from '../src/JSONFunctionBuilder/Reviver/ReviverBuilder'
import { JSONSerializer } from '../src/core/JSONSerializer'
import jsonSerializerDirector from '../src/JSONSerializerDirector'

const filePath = 'src/JSONSerializerDirector.js'

describe(`export default (${filePath})`, () => {
  describe('class JSONSerializerDirector', () => {
    describe('(method) makeJsonSerializer', () => {
      it('Should return a JSONSerializer object', () => {
        // Arrange
        const expected = JSONSerializer

        // Act
        const result = jsonSerializerDirector.makeJsonSerializer()

        // Assert
        expect(result).toBeInstanceOf(expected)
      })
      describe('The JSONSerializer object', () => {
        let jsonSerializer

        beforeEach(() => {
          jsonSerializer = jsonSerializerDirector.makeJsonSerializer()
        })

        it('Should contain a ReplacerBuilder', () => {
          // Arrange
          const expected = ReplacerBuilder

          // Act
          const result = jsonSerializer.replacerBuilder

          // Assert
          expect(result).toBeInstanceOf(expected)
        })
        it('Should contain a ReviverBuilder', () => {
          // Arrange
          const expected = ReviverBuilder

          // Act
          const result = jsonSerializer.reviverBuilder

          // Assert
          expect(result).toBeInstanceOf(expected)
        })
      })
    })
  })
})
