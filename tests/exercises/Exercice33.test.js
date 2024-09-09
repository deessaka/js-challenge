describe('isDivisibleBy3', () => {
  it('should return true if the number is divisible by the given arguments', () => {
    expect(isDivisible(6, 1, 3)).toBe(true)
    expect(isDivisible(100, 5, 4, 10, 25, 20)).toBe(true)
    expect(isDivisible(12, 2)).toBe(true)
    expect(isDivisible(12, 7)).toBe(false)
  })
})
