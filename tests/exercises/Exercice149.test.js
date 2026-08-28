describe('Exercice 149', () => {
  it("cas fixe 1", () => {
    expect(factorial(0)).toBe("1");
  });
  it("cas fixe 2", () => {
    expect(factorial(5)).toBe("120");
  });
  it("cas fixe 3", () => {
    expect(factorial(10)).toBe("3628800");
  });
  it("cas fixe 4", () => {
    expect(factorial(30)).toBe("265252859812191058636308480000000");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  let result = 1n
  for (let i = 2n; i <= BigInt(n); i++) result *= i
  return result.toString()
}
    for (let __i = 0; __i < 15; __i++) {
      const n = rndInt(0, 50);
      expect(factorial(n)).toEqual(__reference(n));
    }
  });
});
