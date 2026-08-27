describe('Exercice 122', () => {
  it("cas fixe 1", () => {
    expect(flapDisplay(["CODE"], [[20,20,28,0]])).toEqual(["WARS"]);
  });
  it("cas fixe 2", () => {
    expect(flapDisplay(["HELLO "], [[15,49,50,48,43,13]])).toEqual(["WORLD!"]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(lines, rotors) {
  const ROTOR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ?!@#&()|<>.:=-+*/0123456789'
  return lines.map((line, lineIdx) => {
    const amounts = rotors[lineIdx]
    let cumulative = 0
    return line.split('').map((ch, i) => {
      cumulative += amounts[i]
      const idx = ROTOR.indexOf(ch)
      return ROTOR[(idx + cumulative) % ROTOR.length]
    }).join('')
  })
}
    for (let __i = 0; __i < 25; __i++) {
      const __text = 'CAT'; const rotors = [[rndInt(1,53), rndInt(1,53), rndInt(1,53)]]; const lines = [__text];
      expect(flapDisplay(lines, rotors)).toEqual(__reference(lines, rotors));
    }
  });
});
