describe('Exercice 70', () => {
  it('should return 0 for ~O~O~O~O P', () => {
    expect(countDeafRats('~O~O~O~O P')).toBe(0)
  })

  it('should return 1 for P O~ O~ ~O O~', () => {
    expect(countDeafRats('P O~ O~ ~O O~')).toBe(1)
  })

  it('should return 2 for ~O~O~O~OP~O~OO~', () => {
    expect(countDeafRats('~O~O~O~OP~O~OO~')).toBe(2)
  })
})
