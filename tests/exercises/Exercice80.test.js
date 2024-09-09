describe('Exercice 80', () => {
  it("should return '(((' for 'din'", () => {
    expect(encode('din')).toBe('(((')
  })

  it("should return '()()()' for 'recede'", () => {
    expect(encode('recede')).toBe('(())()')
  })

  it("should return ')())())' for 'Success'", () => {
    expect(encode('Success')).toBe(')())()')
  })

  it("should return '))((' for '( @'", () => {
    expect(encode('( @')).toBe('))((')
  })
})
