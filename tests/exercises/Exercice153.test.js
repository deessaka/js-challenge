describe('Exercice 153', () => {
  it("cas fixe 1", () => {
    expect(nextBigger(12)).toBe(21);
  });
  it("cas fixe 2", () => {
    expect(nextBigger(513)).toBe(531);
  });
  it("cas fixe 3", () => {
    expect(nextBigger(2017)).toBe(2071);
  });
  it("cas fixe 4", () => {
    expect(nextBigger(9)).toBe(-1);
  });
  it("cas fixe 5", () => {
    expect(nextBigger(111)).toBe(-1);
  });
  it("cas fixe 6", () => {
    expect(nextBigger(531)).toBe(-1);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  const digits = String(n).split('').map(Number)
  let i = digits.length - 2
  while (i >= 0 && digits[i] >= digits[i + 1]) i--
  if (i < 0) return -1
  let j = digits.length - 1
  while (digits[j] <= digits[i]) j--
  ;[digits[i], digits[j]] = [digits[j], digits[i]]
  const tail = digits.slice(i + 1).sort((a, b) => a - b)
  const result = digits.slice(0, i + 1).concat(tail)
  return Number(result.join(''))
}
    for (let __i = 0; __i < 25; __i++) {
      const n = rndInt(10, 999999);
      expect(nextBigger(n)).toEqual(__reference(n));
    }
  });
});
