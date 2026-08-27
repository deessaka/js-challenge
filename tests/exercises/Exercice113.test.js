describe('Exercice 113', () => {
  it("cas fixe 1", () => {
    expect(isAlt("amazon")).toBe(true);
  });
  it("cas fixe 2", () => {
    expect(isAlt("apple")).toBe(false);
  });
  it("cas fixe 3", () => {
    expect(isAlt("banana")).toBe(true);
  });
  it("cas fixe 4", () => {
    expect(isAlt("a")).toBe(true);
  });
  it("cas fixe 5", () => {
    expect(isAlt("b")).toBe(true);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(word) {
  const isVowel = (c) => 'aeiou'.includes(c.toLowerCase())
  for (let i = 1; i < word.length; i++) if (isVowel(word[i]) === isVowel(word[i - 1])) return false
  return true
}
    for (let __i = 0; __i < 25; __i++) {
      const __letters = 'abcdefghijklmnopqrstuvwxyz'.split(''); const word = Array.from({length: rndInt(1,12)}, () => pick(__letters)).join('');
      expect(isAlt(word)).toEqual(__reference(word));
    }
  });
});
