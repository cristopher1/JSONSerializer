import { JSONSerializer } from '../src/core/JSONSerializer'
import jsonSerializerDirector from '../src/core/JSONSerializerDirector'

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
      describe('The JSONSerializer object', () => {})
    })
  })
})
