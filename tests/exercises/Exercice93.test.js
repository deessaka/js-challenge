describe('Exercice93: duplicateCount', () => {
  it("should return 0 for ''", () => {
    expect(duplicateCount('')).toBe(0)
  })
  it("should return 0 for 'abcde'", () => {
    expect(duplicateCount('abcde')).toBe(0)
  })
  it("should return 2 for 'aabbcde'", () => {
    expect(duplicateCount('aabbcde')).toBe(2)
  })
  it("should return 2 for 'aabBcde'", () => {
    expect(duplicateCount('aabBcde')).toBe(2)
  })
  it("should return 2 for 'aA11'", () => {
    expect(duplicateCount('aA11')).toBe(2)
  })
})
