describe('Exercice 134', () => {
  it("cas fixe 1", () => {
    expect(bestMatch([6,4], [1,2])).toBe(1);
  });
  it("cas fixe 2", () => {
    expect(bestMatch([1,2,3,4,5], [0,1,2,3,4])).toBe(4);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(a, b) {
  let bestIdx = 0
  for (let i = 1; i < a.length; i++) {
    const diff = a[i] - b[i], bestDiff = a[bestIdx] - b[bestIdx]
    if (diff < bestDiff || (diff === bestDiff && b[i] > b[bestIdx])) bestIdx = i
  }
  return bestIdx
}
    for (let __i = 0; __i < 20; __i++) {
      const __n = rndInt(2,8); const b = Array.from({length: __n}, () => rndInt(0,10)); const a = b.map(x => x + rndInt(1,10));
      expect(bestMatch(a, b)).toEqual(__reference(a, b));
    }
  });
});
