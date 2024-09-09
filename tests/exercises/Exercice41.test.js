describe('gHappy', () => {
  it('should return true if the string has a g in the right place', () => {
    expect(gHappy('ggg')).toBe(true)
    expect(gHappy('gggg')).toBe(true)
    expect(gHappy('umwho cia q6z onb kbs')).toBe(true)
    expect(gHappy('ggg ggg g ggg')).toBe(false)
    expect(gHappy('good grief')).toBe(false)
  })
})
