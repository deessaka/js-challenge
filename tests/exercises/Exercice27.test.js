describe('Exercice 27', () => {
  it('should return the colour and its association', () => {
    expect(
      colourAssociation([
        ['white', 'goodness'],
        ['blue', 'tranquility'],
      ])
    ).toEqual([{ white: 'goodness' }, { blue: 'tranquility' }])
    expect(
      colourAssociation([
        ['red', 'energy'],
        ['yellow', 'creativity'],
        ['brown', 'friendly'],
        ['green', 'growth'],
      ])
    ).toEqual([
      { red: 'energy' },
      { yellow: 'creativity' },
      { brown: 'friendly' },
      { green: 'growth' },
    ])
  })
})
