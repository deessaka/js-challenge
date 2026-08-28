describe('Exercice 118', () => {
  it("cas fixe 1", () => {
    expect(humanReadable(0)).toBe("00:00:00");
  });
  it("cas fixe 2", () => {
    expect(humanReadable(5)).toBe("00:00:05");
  });
  it("cas fixe 3", () => {
    expect(humanReadable(60)).toBe("00:01:00");
  });
  it("cas fixe 4", () => {
    expect(humanReadable(86399)).toBe("23:59:59");
  });
  it("cas fixe 5", () => {
    expect(humanReadable(359999)).toBe("99:59:59");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(seconds) {
  const h = Math.floor(seconds / 3600), m = Math.floor((seconds % 3600) / 60), s = seconds % 60
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
    for (let __i = 0; __i < 25; __i++) {
      const seconds = rndInt(0, 359999);
      expect(humanReadable(seconds)).toEqual(__reference(seconds));
    }
  });
});
