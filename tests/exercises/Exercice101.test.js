describe('Exercice 101', () => {
  it('should return the correct string', () => {
    expect(toWeirdCase('String')).toEqual('StRiNg')
    expect(toWeirdCase('Weird string case')).toEqual('WeIrD StRiNg CaSe')
  })
})
