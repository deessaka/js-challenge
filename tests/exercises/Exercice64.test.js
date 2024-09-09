describe('Exercice 64', () => {
  it("should return 'I don't think you played football today, I think you didn't play at all!' for 'Today I played football.'", () => {
    expect(translate('Today I played football.')).toBe(
      "I don't think you played football today, I think you didn't play at all!"
    )
  })
})
