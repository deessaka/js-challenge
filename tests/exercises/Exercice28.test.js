describe('Exercice 28', () => {
  it('should return the killed people', () => {
    expect(
      killcount(
        [
          ['Tiffany', 4],
          ['Jack', 6],
          ['Megan', 7],
          ['Tyler', 3],
        ],
        6
      )
    ).toEqual(['Tiffany', 'Tyler'])
  })
})
