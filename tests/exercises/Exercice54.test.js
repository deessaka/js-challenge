describe('peakAndValley', () => {
  it('should return the peaks and valleys', () => {
    expect(peakAndValley([10, 20, 30, 40, 30, 20, 10, 11, 12, 13, 14, 15, 16, 15, 14, 13])).toEqual(
      [40, 10, 16]
    )
    expect(peakAndValley([50, 84, 49, 47, 80, 87, 87, 53, 76, 30, 10])).toEqual([47])
    expect(peakAndValley([45, 94, 41, 76, 29, 96, 28, 13, 84, 69, 25])).toEqual([96, 13])
    expect(peakAndValley([1, 16, 63, 78, 53, 78, 42, 39, 46, 88, 49, 96, 58, 82])).toEqual([39])
    expect(peakAndValley([49, 97, 76, 56, 96, 88, 65, 20, 14, 93, 32])).toEqual([])
  })
})
