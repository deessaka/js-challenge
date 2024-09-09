describe('Exercice 108', () => {
  it('should return the correct result', () => {
    const result = goodName('codewars.com')
    expect(result).toEqual(['c0dewars.com'])
  })

  it('should return the correct result', () => {
    const result = goodName('microsoft.com')
    expect(result).toEqual(['micr0soft.com', 'micros0ft.com'])
  })

  it('should return the correct result', () => {
    const result = goodName('leetcode.com')
    expect(result).toEqual(['1eetcode.com', 'leetc0de.com', 'letcode.com'])
  })

  it('should return the correct result', () => {
    const result = goodName('goodlink.com')
    expect(result).toEqual(['g0odlink.com', 'go0dlink.com', 'godlink.com', 'good1ink.com'])
  })

  it('should return the correct result', () => {
    const result = goodName('fighter2000.com')
    expect(result).toEqual(['fighter200.com'])
  })

  it('should return the correct result', () => {
    const result = goodName('pex4fun.com')
    expect(result).toEqual([])
  })

  it('should return the correct result', () => {
    const result = goodName('xqoomjlieggggg.cn')
    expect(result).toEqual([
      'xq0omjlieggggg.cn',
      'xqo0mjlieggggg.cn',
      'xqomjlieggggg.cn',
      'xqoomj1ieggggg.cn',
      'xqoomjliegggg.cn',
    ])
  })
})
