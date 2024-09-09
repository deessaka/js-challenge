describe('Exercice 73', () => {
  it('should return true for 153', () => {
    expect(narcissistic(153)).toBe(true)
  })

  it('should return false for 1634', () => {
    expect(narcissistic(1634)).toBe(false)
  })
})
