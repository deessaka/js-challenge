describe('Exercice 146', () => {
  it("cas fixe 1", () => {
    expect(sumIntervals([[1,2],[6,10],[11,15]])).toBe(9);
  });
  it("cas fixe 2", () => {
    expect(sumIntervals([[1,4],[7,10],[3,5]])).toBe(7);
  });
  it("cas fixe 3", () => {
    expect(sumIntervals([[1,5],[10,20],[1,6],[16,19],[5,11]])).toBe(19);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0])
  let total = 0, curStart = null, curEnd = null
  for (const [s, e] of sorted) {
    if (curStart === null) { curStart = s; curEnd = e }
    else if (s <= curEnd) { curEnd = Math.max(curEnd, e) }
    else { total += curEnd - curStart; curStart = s; curEnd = e }
  }
  if (curStart !== null) total += curEnd - curStart
  return total
}
    for (let __i = 0; __i < 25; __i++) {
      const intervals = Array.from({length: rndInt(1,8)}, () => { const s = rndInt(0,30); return [s, s + rndInt(1,10)]; });
      expect(sumIntervals(intervals)).toEqual(__reference(intervals));
    }
  });
});
