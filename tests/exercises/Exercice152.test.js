describe('Exercice 152', () => {
  it("cas fixe 1", () => {
    expect(permutations("a")).toEqual(["a"]);
  });
  it("cas fixe 2", () => {
    expect(permutations("ab")).toEqual(["ab","ba"]);
  });
  it("cas fixe 3", () => {
    expect(permutations("aabb")).toEqual(["aabb","abab","abba","baab","baba","bbaa"]);
  });
  it("cas fixe 4", () => {
    expect(permutations("abc")).toEqual(["abc","acb","bac","bca","cab","cba"]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  const chars = str.split('').sort()
  const n = chars.length
  const used = new Array(n).fill(false)
  const current = []
  const results = []
  function backtrack() {
    if (current.length === n) { results.push(current.join('')); return }
    for (let i = 0; i < n; i++) {
      if (used[i]) continue
      if (i > 0 && chars[i] === chars[i - 1] && !used[i - 1]) continue
      used[i] = true; current.push(chars[i])
      backtrack()
      current.pop(); used[i] = false
    }
  }
  backtrack()
  return results
}
    for (let __i = 0; __i < 15; __i++) {
      const __letters='abc'.split(''); const str = Array.from({length: rndInt(1,4)}, () => pick(__letters)).join('');
      expect(permutations(str)).toEqual(__reference(str));
    }
  });
});
