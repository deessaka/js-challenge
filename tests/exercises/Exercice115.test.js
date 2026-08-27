describe('Exercice 115', () => {
  it("cas fixe 1", () => {
    expect(findTheKey("123412341234123412")).toBe("1234");
  });
  it("cas fixe 2", () => {
    expect(findTheKey("123")).toBe("123");
  });
  it("cas fixe 3", () => {
    expect(findTheKey("1231")).toBe("123");
  });
  it("cas fixe 4", () => {
    expect(findTheKey("123124")).toBe("123124");
  });
  it("cas fixe 5", () => {
    expect(findTheKey("111111")).toBe("1");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  for (let len = 1; len <= str.length; len++) {
    const key = str.slice(0, len)
    let ok = true
    for (let i = 0; i < str.length; i++) if (str[i] !== key[i % len]) { ok = false; break }
    if (ok) return key
  }
  return str
}
    for (let __i = 0; __i < 20; __i++) {
      const __key = String(rndInt(1,9999)); let str = __key.repeat(rndInt(2,5)); str = str.slice(0, rndInt(Math.max(1, __key.length), str.length));
      expect(findTheKey(str)).toEqual(__reference(str));
    }
  });
});
