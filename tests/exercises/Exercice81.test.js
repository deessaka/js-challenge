describe('Exercice 81', () => {
  it("should return 'YES' for [25, 25, 50, 50]", () => {
    expect(tickets([25, 25, 50, 50])).toBe('YES')
  })

  it("should return 'NO' for [25, 100]", () => {
    expect(tickets([25, 100])).toBe('NO')
  })
})
