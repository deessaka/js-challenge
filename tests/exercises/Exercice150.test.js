describe('Exercice 150', () => {
  it("cas fixe 1", () => {
    expect(formatDuration(0)).toBe("now");
  });
  it("cas fixe 2", () => {
    expect(formatDuration(62)).toBe("1 minute and 2 seconds");
  });
  it("cas fixe 3", () => {
    expect(formatDuration(3662)).toBe("1 hour, 1 minute and 2 seconds");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(seconds) {
  if (seconds === 0) return 'now'
  const units = [['year', 365 * 24 * 3600], ['day', 24 * 3600], ['hour', 3600], ['minute', 60], ['second', 1]]
  const parts = []
  let rem = seconds
  for (const [name, secs] of units) {
    const val = Math.floor(rem / secs)
    if (val > 0) { parts.push(`${val} ${name}${val > 1 ? 's' : ''}`); rem -= val * secs }
  }
  if (parts.length === 1) return parts[0]
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]
}
    for (let __i = 0; __i < 25; __i++) {
      const seconds = rndInt(1, 100000000);
      expect(formatDuration(seconds)).toEqual(__reference(seconds));
    }
  });
});
