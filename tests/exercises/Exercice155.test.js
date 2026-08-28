describe('Exercice 155', () => {
  it("cas fixe 1", () => {
    expect(snail([[1,2,3],[4,5,6],[7,8,9]])).toEqual([1,2,3,6,9,8,7,4,5]);
  });
  it("cas fixe 2", () => {
    expect(snail([[1,2,3],[8,9,4],[7,6,5]])).toEqual([1,2,3,4,5,6,7,8,9]);
  });
  it("cas fixe 3", () => {
    expect(snail([[]])).toEqual([]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(matrix) {
  const result = []
  matrix = matrix.map((row) => [...row])
  while (matrix.length) {
    result.push(...matrix.shift())
    if (matrix.length && matrix[0].length) {
      for (const row of matrix) result.push(row.pop())
      result.push(...matrix.pop().reverse())
      for (let i = matrix.length - 1; i >= 0; i--) result.push(matrix[i].shift())
    }
  }
  return result
}
    for (let __i = 0; __i < 20; __i++) {
      let __ctr=1; const __n=rndInt(1,5); const matrix = Array.from({length:__n}, () => Array.from({length:__n}, () => __ctr++));
      expect(snail(matrix)).toEqual(__reference(matrix));
    }
  });
});
