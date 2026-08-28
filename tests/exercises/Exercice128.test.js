function isPrime(n) { if (n < 2) return false; for (let i = 2; i * i <= n; i++) if (n % i === 0) return false; return true; }
describe('Exercice 128', () => {
  it("cas fixe 1", () => {
    expect(gap(4, 130, 200)).toEqual([163,167]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(g, m, n) {
  let prev = null
  for (let i = m; i <= n; i++) {
    if (isPrime(i)) {
      if (prev !== null && i - prev === g) return [prev, i]
      prev = i
    }
  }
  return null
}
    for (let __i = 0; __i < 15; __i++) {
      const g = rndInt(2,10)*2; const m = rndInt(2,500); const n = m + rndInt(200,1000);
      expect(gap(g, m, n)).toEqual(__reference(g, m, n));
    }
  });
});
