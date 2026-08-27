describe('Exercice 126', () => {
  it("cas fixe 1", () => {
    expect(maxSequence([-2,1,-3,4,-1,2,1,-5,4])).toBe(6);
  });
  it("cas fixe 2", () => {
    expect(maxSequence([])).toBe(0);
  });
  it("cas fixe 3", () => {
    expect(maxSequence([-1,-2,-3])).toBe(0);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(arr) {
  let max = 0, cur = 0
  for (const n of arr) { cur = Math.max(0, cur + n); max = Math.max(max, cur) }
  return max
}
    for (let __i = 0; __i < 25; __i++) {
      const arr = Array.from({length: rndInt(0,12)}, () => rndInt(-20,20));
      expect(maxSequence(arr)).toEqual(__reference(arr));
    }
  });
});
