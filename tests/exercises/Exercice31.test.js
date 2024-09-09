describe('Exercice 31', () => {
  it('should return the winner', () => {
    expect(battle('One', 'Two')).toEqual('Two')
    expect(battle('One', 'Neo')).toEqual('One')
    expect(battle('One', 'neO')).toEqual('Tie!')
    expect(battle('Foo', 'BAR')).toEqual('Tie!')
    expect(battle('Four', 'Five')).toEqual('Four')
  })
})
