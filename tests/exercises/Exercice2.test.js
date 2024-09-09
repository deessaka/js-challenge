describe('Exercice 2', () => {
  it('Nous devons renvoyer le nombre de moutons présents dans le tableau', () => {
    expect(
      number([true, true, null, false, true, true, undefined, true, 'true', false, '', true])
    ).toBe(7)

    expect(
      number([
        true,
        true,
        null,
        false,
        true,
        true,
        undefined,
        true,
        'true',
        false,
        '',
        true,
        'false',
        false,
      ])
    ).toBe(8)
  })
})
