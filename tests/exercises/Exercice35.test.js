describe('filterList', () => {
  it('should return a new list with only numbers', () => {
    expect(filterList([1, 2, 'a', 'b'])).toEqual([1, 2])
    expect(filterList([1, 'a', 'b', 0, 15])).toEqual([1, 0, 15])
    expect(filterList([1, 2, 'aasf', '3', '124', 123])).toEqual([1, 2, 123])
  })
})
