describe('Exercice 144', () => {
  it("cas fixe 1", () => {
    expect(pascalsTriangle(4)).toEqual([1,1,1,1,2,1,1,3,3,1]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(n) {
  const result = []
  let row = [1]
  for (let r = 0; r < n; r++) {
    result.push(...row)
    const next = [1]
    for (let i = 1; i < row.length; i++) next.push(row[i - 1] + row[i])
    next.push(1)
    row = next
  }
  return result
}
    for (let __i = 0; __i < 15; __i++) {
      const n = rndInt(0, 10);
      expect(pascalsTriangle(n)).toEqual(__reference(n));
    }
  });
});
