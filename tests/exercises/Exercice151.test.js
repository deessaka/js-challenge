describe('Exercice 151', () => {
  it("cas fixe 1", () => {
    expect(solution(1000)).toBe("M");
  });
  it("cas fixe 2", () => {
    expect(solution(1990)).toBe("MCMXC");
  });
  it("cas fixe 3", () => {
    expect(solution(2008)).toBe("MMVIII");
  });
  it("cas fixe 4", () => {
    expect(solution(1666)).toBe("MDCLXVI");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let result = ''
  for (const [val, sym] of table) while (n >= val) { result += sym; n -= val }
  return result
}
    for (let __i = 0; __i < 25; __i++) {
      const n = rndInt(1, 3999);
      expect(solution(n)).toEqual(__reference(n));
    }
  });
});
