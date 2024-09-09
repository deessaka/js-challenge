describe('Exercice 75', () => {
  it("should return 'HEY JUDE' for '... ..-.--. .- - ...'", () => {
    expect(decodeMorse('.... ..-.-- .--- ..- - ...')).toBe('HEY JUDE')
  })

  it("should return '' for '... ..-.--. .- - ...'", () => {
    expect(decodeMorse('... ..-.--. .- - ...')).toBe('')
  })
})
