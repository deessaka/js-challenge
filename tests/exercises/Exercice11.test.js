describe('Exercice 11', () => {
  it('code PIN', () => {
    expect(ValidatePIN('1234')).toBe(true)
    expect(ValidatePIN('12345')).toBe(false)
    expect(ValidatePIN('a234')).toBe(false)
  })
})
