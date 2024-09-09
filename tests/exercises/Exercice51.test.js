describe('distributionOf', () => {
  it('should return the distribution', () => {
    expect(distributionOf([4, 2, 9, 5, 2, 7])).toEqual([14, 15])
    expect(distributionOf([10, 1000, 2, 1])).toEqual([12, 1001])
  })
})
