describe('Exercice90: findUniq', () => {
  it('should return 2 for [1, 1, 1, 2, 1, 1]', () => {
    expect(findUniq([1, 1, 1, 2, 1, 1])).toBe(2)
  })
  it('should return 0.55 for [0, 0, 0.55, 0, 0]', () => {
    expect(findUniq([0, 0, 0.55, 0, 0])).toBe(0.55)
  })
})
