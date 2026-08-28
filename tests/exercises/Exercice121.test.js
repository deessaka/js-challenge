describe('Exercice 121', () => {
  it("cas fixe 1", () => {
    expect(toCamelCase("")).toBe("");
  });
  it("cas fixe 2", () => {
    expect(toCamelCase("the_stealth_warrior")).toBe("theStealthWarrior");
  });
  it("cas fixe 3", () => {
    expect(toCamelCase("The-Stealth-Warrior")).toBe("TheStealthWarrior");
  });
  it("cas fixe 4", () => {
    expect(toCamelCase("A-B-C")).toBe("ABC");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  if (!str) return ''
  const parts = str.split(/[-_]/)
  return parts[0] + parts.slice(1).map((p) => p[0].toUpperCase() + p.slice(1)).join('')
}
    for (let __i = 0; __i < 20; __i++) {
      const __words = ['the','stealth','warrior','A','B','C','foo','Bar','baz']; const __sep = pick(['-','_']); const str = Array.from({length: rndInt(1,5)}, () => pick(__words)).join(__sep);
      expect(toCamelCase(str)).toEqual(__reference(str));
    }
  });
});
