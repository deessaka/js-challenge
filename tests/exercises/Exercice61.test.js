describe('Exercice 61', () => {
  it("should return 'abigailtheta' for ['zone','abigail','theta','forme','libe','zas','theta','abigail'], 2", () => {
    expect(
      longest_consec(['zone', 'abigail', 'theta', 'forme', 'libe', 'zas', 'theta', 'abigail'], 2)
    ).toBe('abigailtheta')
  })
})
