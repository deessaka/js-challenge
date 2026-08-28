describe('Exercice 88', () => {
  it("cas fixe 1", () => {
    expect(digitalRoot(16)).toBe(7);
  });
  it("cas fixe 2", () => {
    expect(digitalRoot(942)).toBe(6);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  while (n >= 10) n = String(n).split('').reduce((a, d) => a + Number(d), 0)
  return n
}
    for (let __i = 0; __i < 25; __i++) {
      const n = rndInt(0, 999999);
      expect(digitalRoot(n)).toEqual(__reference(n));
    }
  });
});
