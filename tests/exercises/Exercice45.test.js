describe('tacofy', () => {
  it('should return the tacos', () => {
    expect(tacofy('')).toEqual(['shell', 'shell'])
    expect(tacofy('a')).toEqual(['shell', 'beef', 'shell'])
    expect(tacofy('ggg')).toEqual(['shell', 'guacamole', 'guacamole', 'guacamole', 'shell'])
    expect(tacofy('ogl')).toEqual(['shell', 'beef', 'guacamole', 'lettuce', 'shell'])
    expect(tacofy('ydjkpwqrzto')).toEqual(['shell', 'tomato', 'beef', 'shell'])
  })
})
