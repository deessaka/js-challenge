describe('Exercice 71', () => {
  it('should return 3 for [1,2,3,4,3,2,1]', () => {
    expect(findEvenIndex([1, 2, 3, 4, 3, 2, 1])).toBe(3)
  })

  it('should return 1 for [1,100,50, -51,1,1]', () => {
    expect(findEvenIndex([1, 100, 50, -51, 1, 1])).toBe(1)
  })

  it('should return -1 for [1,2,3,4,5,6]', () => {
    expect(findEvenIndex([1, 2, 3, 4, 5, 6])).toBe(-1)
  })

  it('should return 3 for [20,10,30,10,10,15,35]', () => {
    expect(findEvenIndex([20, 10, 30, 10, 10, 15, 35])).toBe(3)
  })
})
