describe('Exercice 62', () => {
  it("should return ['*', '* * *', '* * * * * *'] for 3", () => {
    expect(constructionTour(3)).toEqual(['*', '* * *', '* * * * *'])
  })

  it("should return ['*', '* * *', '* * * * * *', '* * * * * * * *', '* * * * * * * * * *', '* * * * * * * * * * *'] for 6", () => {
    expect(constructionTour(6)).toEqual([
      '*',
      '* * *',
      '* * * * *',
      '* * * * * * *',
      '* * * * * * * * *',
      '* * * * * * * * * *',
    ])
  })
})
