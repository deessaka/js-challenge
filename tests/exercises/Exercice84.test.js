describe('Exercice 84: difference', () => {
  it('should return [2] for [1,2],[1]', () => {
    expect(difference([1, 2], [1])).toEqual([2])
  })
  it('should return [1,3] for [1,2,2,2,3],[2]', () => {
    expect(difference([1, 2, 2, 2, 3], [2])).toEqual([1, 3])
  })
})
