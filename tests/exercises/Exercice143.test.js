const __generate = (m, n) => {
  const hithandler = { get: (_, col) => (col == n ? true : false), set: () => false };
  const misshandler = { get: () => false, set: () => false };
  const hit = new Proxy({}, hithandler);
  const miss = new Proxy({}, misshandler);
  const rowhandler = { get: (_, row) => (row == m ? hit : miss), set: () => false };
  return new Proxy({}, rowhandler);
};

describe('Exercice 143', () => {
  it('cas fixe', () => {
    const mat = __generate(0, 10);
    expect(findTrue(mat)).toEqual([0, 10]);
  });

  it('tests aléatoires', () => {
    for (let __i = 0; __i < 15; __i++) {
      const m = rndInt(0, 15);
      const n = rndInt(0, 15);
      const mat = __generate(m, n);
      expect(findTrue(mat)).toEqual([m, n]);
    }
  });
});
