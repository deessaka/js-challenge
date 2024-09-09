describe('Exercice 65', () => {
  it('should return 3 for [2, 4, 7, 8, 10]', () => {
    expect(iqTest([2, 4, 7, 8, 10])).toBe(3)
  })

  it('should return 2 for [1, 2, 1, 1]', () => {
    expect(iqTest([1, 2, 1, 1])).toBe(2)
  })
})
