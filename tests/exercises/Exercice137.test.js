describe('Exercice 137', () => {
  it("cas fixe 1", () => {
    expect(scramble("rkqodlw", "world")).toBe(true);
  });
  it("cas fixe 2", () => {
    expect(scramble("cedewaraaossoqqyt", "codewars")).toBe(true);
  });
  it("cas fixe 3", () => {
    expect(scramble("katas", "steak")).toBe(false);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str1, str2) {
  const count = {}
  for (const c of str1) count[c] = (count[c] || 0) + 1
  for (const c of str2) { if (!count[c]) return false; count[c]-- }
  return true
}
    for (let __i = 0; __i < 25; __i++) {
      const __letters='abcdefgh'.split(''); const str1 = Array.from({length: rndInt(3,15)}, () => pick(__letters)).join(''); const str2 = Array.from({length: rndInt(1,6)}, () => pick(__letters)).join('');
      expect(scramble(str1, str2)).toEqual(__reference(str1, str2));
    }
  });
});
