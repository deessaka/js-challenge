describe('Exercice 24', () => {
  it('should return the number of smaller numbers to the right of the given number', () => {
    expect(smaller([5, 4, 3, 2, 1])).toEqual([4, 3, 2, 1, 0])
    expect(smaller([1, 2, 0])).toEqual([1, 1, 0])
  })
})
