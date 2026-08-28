describe('Exercice 131', () => {
  it("cas fixe 1", () => {
    expect(validParentheses("()")).toBe(true);
  });
  it("cas fixe 2", () => {
    expect(validParentheses(")(()))")).toBe(false);
  });
  it("cas fixe 3", () => {
    expect(validParentheses("(")).toBe(false);
  });
  it("cas fixe 4", () => {
    expect(validParentheses("(())((()())())")).toBe(true);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(s) {
  let depth = 0
  for (const c of s) { if (c === '(') depth++; else if (c === ')') { depth--; if (depth < 0) return false } }
  return depth === 0
}
    for (let __i = 0; __i < 25; __i++) {
      const s = Array.from({length: rndInt(1,15)}, () => pick(['(', ')'])).join('');
      expect(validParentheses(s)).toEqual(__reference(s));
    }
  });
});
