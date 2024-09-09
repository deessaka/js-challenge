describe('Exercice 105', () => {
  it('should return the correct number of bees', () => {
    const result = beeHive(['beeb', 'bee', 'bee', 'bee', 'bee', 'bee'])

    expect(result).toBe(8)
  })

  it('should return the correct number of bees', () => {
    const result = beeHive(['beebeeebeeb', 'beeeeb', 'beeb', 'bee', 'bee', 'bee'])

    expect(result).toBe(13)
  })
})
