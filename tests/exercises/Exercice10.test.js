describe('Exercice 10', () => {
  it('compter en Arara', () => {
    expect(countArara(1)).toBe('anane')
    expect(countArara(3)).toBe('adak anane')
    expect(countArara(8)).toBe('adak adak adak adak')
  })
})
