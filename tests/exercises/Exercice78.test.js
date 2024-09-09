describe('Exercice 78', () => {
  it('should return 5 for [20,1,-1,2,-2,3,3,5,5,1,2,4,20,4,-1,-2,5]', () => {
    expect(findOdd([20, 1, -1, 2, -2, 3, 3, 5, 5, 1, 2, 4, 20, 4, -1, -2, 5])).toBe(5)
  })

  it('should return -1 for [1,1,2,-2,5,2,4,4,-1,-2,5]', () => {
    expect(findOdd([1, 1, 2, -2, 5, 2, 4, 4, -1, -2, 5])).toBe(-1)
  })

  it('should return 5 for [20,1,1,2,2,3,3,5,5,4,20,4,5]', () => {
    expect(findOdd([20, 1, 1, 2, 2, 3, 3, 5, 5, 4, 20, 4, 5])).toBe(5)
  })

  it('should return 10 for [10]', () => {
    expect(findOdd([10])).toBe(10)
  })
})
