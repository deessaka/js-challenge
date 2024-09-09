describe('ascenseur', () => {
  it('should return the number of seconds to reach level 1', () => {
    expect(ascenseur(5, 6, [1, 2, 3, 10])).toBe(12)
    expect(ascenseur(1, 6, [1, 2, 3, 10])).toBe(0)
    expect(ascenseur(5, 4, [2, 3, 4, 5])).toBe(20)
  })
})
