describe('Exercice 67', () => {
  it("cas fixe 1", () => {
    expect(isValidWalk(["n","s","n","s","n","s","n","s","n","s"])).toBe(true);
  });
  it("cas fixe 2", () => {
    expect(isValidWalk(["w","e","w","e","w","e","w","e","w","e","w","e"])).toBe(false);
  });
  it("cas fixe 3", () => {
    expect(isValidWalk(["w"])).toBe(false);
  });
  it("cas fixe 4", () => {
    expect(isValidWalk(["n","n","n","s","n","s","n","s","n","s"])).toBe(false);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(walk) {
  if (walk.length !== 10) return false
  let x = 0, y = 0
  for (const d of walk) {
    if (d === 'n') y++
    else if (d === 's') y--
    else if (d === 'e') x++
    else if (d === 'w') x--
  }
  return x === 0 && y === 0
}
    for (let __i = 0; __i < 25; __i++) {
      const __dirs = ['n','s','e','w']; const walk = Array.from({length: rndInt(1,14)}, () => pick(__dirs));
      expect(isValidWalk(walk)).toEqual(__reference(walk));
    }
  });
});
