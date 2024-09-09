describe('Exercice89: findMissingLetter', () => {
  it("should return 'e' for ['a','b','c','d','f']", () => {
    expect(findMissingLetter(['a', 'b', 'c', 'd', 'f'])).toBe('e')
  })
  it("should return 'P' for ['O','Q','R','S']", () => {
    expect(findMissingLetter(['O', 'Q', 'R', 'S'])).toBe('P')
  })
})
