describe('Exercice 9', () => {
  it('Accumulation de lettres', () => {
    expect(accum('abcd')).toBe('A-Bb-Ccc-Dddd')
    expect(accum('RqaEzty')).toBe('R-Qq-Aaa-Eeee-Zzzzz-Tttttt-Yyyyyyy')
    expect(accum('cwAt')).toBe('C-Ww-Aaa-Tttt')
  })
})
