const __phoneMap = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' };
describe('Exercice 132', () => {
  it("cas fixe 1", () => {
    expect(letterCombinations("23")).toEqual(["ad","bd","cd","ae","be","ce","af","bf","cf"]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(digits) {
  const map = { 2: 'abc', 3: 'def', 4: 'ghi', 5: 'jkl', 6: 'mno', 7: 'pqrs', 8: 'tuv', 9: 'wxyz' }
  const sets = digits.split('').map((d) => map[d])
  const n = sets.length
  if (n === 0) return []
  const sizes = sets.map((s) => s.length)
  const total = sizes.reduce((a, b) => a * b, 1)
  const result = []
  for (let idx = 0; idx < total; idx++) {
    const chars = new Array(n)
    let weight = 1
    for (let pos = 0; pos < n; pos++) {
      const digitVal = Math.floor(idx / weight) % sizes[pos]
      chars[pos] = sets[pos][digitVal]
      weight *= sizes[pos]
    }
    result.push(chars.join(''))
  }
  return result
}
    for (let __i = 0; __i < 15; __i++) {
      const digits = Array.from({length: rndInt(1,3)}, () => String(rndInt(2,9))).join('');
      expect(letterCombinations(digits)).toEqual(__reference(digits));
    }
  });
});
