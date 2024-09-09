describe('Exercice 57', () => {
  it('should return [1] for 1', () => {
    expect(atomicNumber(1)).toEqual([1])
  })

  it('should return [2, 8] for 10', () => {
    expect(atomicNumber(10)).toEqual([2, 8])
  })

  it('should return [2, 8, 1] for 11', () => {
    expect(atomicNumber(11)).toEqual([2, 8, 1])
  })

  it('should return [2, 8, 18, 19] for 47', () => {
    expect(atomicNumber(47)).toEqual([2, 8, 18, 19])
  })
})
