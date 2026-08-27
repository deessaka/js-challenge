describe('Exercice 127', () => {
  it("cas fixe 1", () => {
    expect(anagrams("abba", ["aabb","abcd","bbaa","dada"])).toEqual(["aabb","bbaa"]);
  });
  it("cas fixe 2", () => {
    expect(anagrams("racer", ["crazer","carer","racar","caers","racer"])).toEqual(["carer","racer"]);
  });
  it("cas fixe 3", () => {
    expect(anagrams("laser", ["lazing","lazy","lacer"])).toEqual([]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(word, words) {
  const key = (s) => s.split('').sort().join('')
  const k = key(word)
  return words.filter((w) => key(w) === k)
}
    for (let __i = 0; __i < 20; __i++) {
      const __letters='abcde'.split(''); const word = Array.from({length: rndInt(2,6)}, () => pick(__letters)).join(''); const words = Array.from({length: rndInt(1,6)}, () => shuffle(word.split('')).join('').slice(0, word.length + (rndInt(0,1)?0:rndInt(-1,1))) || word);
      expect(anagrams(word, words)).toEqual(__reference(word, words));
    }
  });
});
