describe('diff', () => {
  it('should return the differences', () => {
    expect(diff(['a', 'b', 'z', 'd', 'e', 'd'], ['a', 'b', 'j', 'j'])).toEqual(['d', 'e', 'j', 'z'])
    expect(diff(['a', 'b', 'z', 'd', 'e', 'd'], ['a', 'b', 'j', 'j', 'a'])).toEqual([
      'd',
      'e',
      'j',
      'z',
    ])
    expect(diff(['a', 'b', 'z', 'd', 'e', 'd'], ['a', 'b', 'j', 'j', 'a', 'b'])).toEqual([
      'd',
      'e',
      'j',
      'z',
    ])
    expect(diff(['a', 'b', 'z', 'd', 'e', 'd'], ['a', 'b', 'j', 'j', 'a', 'b', 'z'])).toEqual([
      'd',
      'e',
      'j',
    ])
  })
})
