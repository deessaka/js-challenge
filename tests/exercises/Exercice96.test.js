describe('Exercice96: cycle', () => {
  it('should return [0, 3, 6, 9] for [1, 2, 3, 1, 2, 3, 1, 2, 3]', () =>
    expect(cycle([1, 2, 3, 1, 2, 3, 1, 2, 3])).toEqual([0, 3, 6, 9]))

  it('should return [] for [1, 2, 3, 4, 5, 6]', () => expect(cycle([1, 2, 3, 4, 5, 6])).toEqual([]))

  it('should return [0, 3] for [2,3,4,2,3,4]', () =>
    expect(cycle([2, 3, 4, 2, 3, 4])).toEqual([0, 3]))
})
