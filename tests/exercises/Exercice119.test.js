describe('Exercice 119', () => {
  it("cas fixe 1", () => {
    expect(generateHashtag(" Hello there thanks for trying my Kata")).toBe("#HelloThereThanksForTryingMyKata");
  });
  it("cas fixe 2", () => {
    expect(generateHashtag("Hello World")).toBe("#HelloWorld");
  });
  it("cas fixe 3", () => {
    expect(generateHashtag("")).toBe(false);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  if (!str) return false
  const words = str.split(/\s+/).filter(Boolean)
  if (words.length === 0) return false
  const tag = '#' + words.map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase()).join('')
  if (tag.length > 140) return false
  return tag
}
    for (let __i = 0; __i < 20; __i++) {
      const __words = ['pig','latin','is','cool','hello','world','javascript','test','kata','code','foo','bar']; const str = Array.from({length: rndInt(1,6)}, () => pick(__words)).join(' ');
      expect(generateHashtag(str)).toEqual(__reference(str));
    }
  });
});
