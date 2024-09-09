describe('Exercice 79', () => {
  it("should return 'This is a test!' for 'This is a test!', 0", () => {
    expect(encrypt('This is a test!', 0)).toBe('This is a test!')
  })

  it("should return 'hsi  etTi sats!' for 'This is a test!', 1", () => {
    expect(encrypt('This is a test!', 1)).toBe('hsi  etTi sats!')
  })

  it("should return 's eT ashi tist!' for 'This is a test!', 2", () => {
    expect(encrypt('This is a test!', 2)).toBe('s eT ashi tist!')
  })

  it("should return ' Tah itse sits!' for ' Tah itse sits!', 3", () => {
    expect(encrypt(' Tah itse sits!', 3)).toBe(' Tah itse sits!')
  })

  it("should return 'hskt svr neetn!Ti aai eyitrsig' for 'hskt svr neetn!Ti aai eyitrsig', 1", () => {
    expect(encrypt('hskt svr neetn!Ti aai eyitrsig', 1)).toBe('hskt svr neetn!Ti aai eyitrsig')
  })
})
