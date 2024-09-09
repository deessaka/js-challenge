describe('XO', () => {
  it('should return true if the string has the same number of x and o', () => {
    expect(XO('xo')).toBe(true)
    expect(XO('xxOo')).toBe(true)
    expect(XO('xxxm')).toBe(false)
    expect(XO('Oo')).toBe(false)
    expect(XO('ooom')).toBe(false)
    expect(XO('abcdefghijklmnopqrstuvwxyz')).toBe(true)
  })
})
