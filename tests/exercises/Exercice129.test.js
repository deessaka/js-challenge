function divisorsOf(k) { const res = []; for (let i = 1; i * i <= k; i++) if (k % i === 0) { res.push(i); if (i !== k / i) res.push(k / i); } return res; }
function isPerfectSquare(x) { const r = Math.round(Math.sqrt(x)); return r * r === x; }
describe('Exercice 129', () => {
  it("cas fixe 1", () => {
    expect(listSquared(1, 250)).toEqual([[1,1],[42,2500],[246,84100]]);
  });
  it("cas fixe 2", () => {
    expect(listSquared(42, 250)).toEqual([[42,2500],[246,84100]]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(m, n) {
  const result = []
  for (let k = m; k <= n; k++) {
    const sumSq = divisorsOf(k).reduce((a, d) => a + d * d, 0)
    if (isPerfectSquare(sumSq)) result.push([k, sumSq])
  }
  return result
}
    for (let __i = 0; __i < 10; __i++) {
      const m = rndInt(1,100); const n = m + rndInt(50,300);
      expect(listSquared(m, n)).toEqual(__reference(m, n));
    }
  });
});
