describe('Exercice 147', () => {
  it("cas fixe 1", () => {
    expect(validBraces("() {} []")).toBe(true);
  });
  it("cas fixe 2", () => {
    expect(validBraces("(}")).toBe(false);
  });
  it("cas fixe 3", () => {
    expect(validBraces("[(])")).toBe(false);
  });
  it("cas fixe 4", () => {
    expect(validBraces("([{}])")).toBe(true);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(s) {
  const map = { ')': '(', ']': '[', '}': '{' }
  const stack = []
  for (const c of s) {
    if (c === '(' || c === '[' || c === '{') stack.push(c)
    else { if (stack.pop() !== map[c]) return false }
  }
  return stack.length === 0
}
    for (let __i = 0; __i < 25; __i++) {
      const s = Array.from({length: rndInt(1,15)}, () => pick(['(',')','[',']','{','}'])).join('');
      expect(validBraces(s)).toEqual(__reference(s));
    }
  });
});
