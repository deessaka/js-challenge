describe('checkCoupon', () => {
  it('should return true if the coupon is valid', () => {
    expect(checkCoupon('123', '123', 'September 5, 2014', 'October 1, 2014')).toBe(true)
    expect(checkCoupon('123a', '123', 'September 5, 2014', 'October 1, 2014')).toBe(false)
    expect(checkCoupon('12abcd3', '12abcd3', 'January 5, 2014', 'January 1, 2014')).toBe(false)
    expect(checkCoupon(0, false, 'September 5, 2014', 'October 1, 2014')).toBe(false)
    expect(checkCoupon(123, '123', 'September 5, 2014', 'October 1, 2014')).toBe(false)
  })
})
