describe('Exercice 16', () => {
  it('findLongest', () => {
    expect(findLongest([1, 10, 100])).toEqual(100)
    expect(findLongest([9000, 8, 800])).toEqual(9000)
    expect(findLongest([8, 900, 500])).toEqual(900)
  })
})
