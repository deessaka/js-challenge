describe('Exercice 30', () => {
  it('should return the winner', () => {
    expect(alphabetWar('z')).toEqual('Right side wins!')
    expect(alphabetWar('zdqmwpbs')).toEqual("Let's fight again!")
    expect(alphabetWar('zzzzs')).toEqual('Right side wins!')
    expect(alphabetWar('wwwwwwz')).toEqual('Left side wins!')
  })
})
