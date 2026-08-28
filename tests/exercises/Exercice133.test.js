describe('Exercice 133', () => {
  it("cas fixe 1", () => {
    expect(toNegabinary(6)).toBe("11010");
  });
  it("cas fixe 2", () => {
    expect(toNegabinary(-6)).toBe("1110");
  });
  it("cas fixe 3", () => {
    expect(toNegabinary(4)).toBe("100");
  });
  it("cas fixe 4", () => {
    expect(toNegabinary(18)).toBe("10110");
  });
  it("cas fixe 5", () => {
    expect(toNegabinary(-11)).toBe("110101");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  if (n === 0) return '0'
  let result = ''
  while (n !== 0) {
    const r = ((n % 2) + 2) % 2
    result = String(r) + result
    n = (n - r) / -2
  }
  return result
}
    for (let __i = 0; __i < 25; __i++) {
      const n = rndInt(-2000, 2000);
      expect(toNegabinary(n)).toEqual(__reference(n));
    }
  });
});
