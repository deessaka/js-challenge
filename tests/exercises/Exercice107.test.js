describe('Exercice 107', () => {
  it('should return the correct result', () => {
    const result = giftTriplets('doll')
    expect(result).toBe(1)
  })

  it('should return the correct result', () => {
    const result = giftTriplets('aaaaaaa')
    expect(result).toBe(5)
  })

  it('should return the correct result', () => {
    const result = giftTriplets('cat')
    expect(result).toBe(0)
  })
})
