describe('Exercice 111', () => {
  it("cas fixe 1", () => {
    expect(catchThief("X1X#2X#XX")).toBe(3);
  });
  it("cas fixe 2", () => {
    expect(catchThief("X5X#3X###XXXX##1#X1X")).toBe(5);
  });
  it("cas fixe 3", () => {
    expect(catchThief("X#X1#X9XX")).toBe(5);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(queue) {
  const caught = new Set()
  for (let i = 0; i < queue.length; i++) {
    const c = queue[i]
    if (c >= '1' && c <= '9') {
      const range = Number(c)
      for (let j = Math.max(0, i - range); j <= Math.min(queue.length - 1, i + range); j++) {
        if (queue[j] === 'X') caught.add(j)
      }
    }
  }
  return caught.size
}
    for (let __i = 0; __i < 25; __i++) {
      let queue = ''; const __len = rndInt(5,20); for (let __k=0;__k<__len;__k++){ const __r = rndInt(0,2); queue += __r===0?'X':__r===1?'#':String(rndInt(1,9)); }
      expect(catchThief(queue)).toEqual(__reference(queue));
    }
  });
});
