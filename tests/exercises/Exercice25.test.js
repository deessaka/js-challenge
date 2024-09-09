describe('Exercice 25', () => {
  it('should return the complementary DNA strand', () => {
    expect(DNAStrand('ATTGC')).toBe('TAACG')
    expect(DNAStrand('GTAT')).toBe('CATA')
  })
})
