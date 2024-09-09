describe('Exercice 18', () => {
  it('longestWord', () => {
    expect(longestWord('a b c d e fgh')).toEqual('fgh')
    expect(longestWord('one two three')).toEqual('three')
    expect(longestWord('red blue grey')).toEqual('grey')
  })
})
