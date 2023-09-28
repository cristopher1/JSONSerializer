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
})
