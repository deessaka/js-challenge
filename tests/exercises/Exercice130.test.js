describe('Exercice 130', () => {
  it("cas fixe 1", () => {
    expect(powerSet([1,2])).toEqual([[],[2],[1],[1,2]]);
  });
  it("cas fixe 2", () => {
    expect(powerSet([1,2,3])).toEqual([[],[3],[2],[2,3],[1],[1,3],[1,2],[1,2,3]]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(nums) {
  if (nums.length === 0) return [[]]
  const [first, ...rest] = nums
  const withoutFirst = powerSet(rest)
  const withFirst = withoutFirst.map((s) => [first, ...s])
  return [...withoutFirst, ...withFirst]
}
    for (let __i = 0; __i < 15; __i++) {
      const nums = Array.from({length: rndInt(0,6)}, (_, i) => i + 1);
      expect(powerSet(nums)).toEqual(__reference(nums));
    }
  });
});
