describe('Exercice 124', () => {
  it("cas fixe 1", () => {
    expect(dirReduc(["NORTH","SOUTH","SOUTH","EAST","WEST","NORTH","WEST"])).toEqual(["WEST"]);
  });
  it("cas fixe 2", () => {
    expect(dirReduc(["NORTH","WEST","SOUTH","EAST"])).toEqual(["NORTH","WEST","SOUTH","EAST"]);
  });
  it("cas fixe 3", () => {
    expect(dirReduc(["NORTH","SOUTH","EAST","WEST","EAST","WEST"])).toEqual([]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(arr) {
  const opposite = { NORTH: 'SOUTH', SOUTH: 'NORTH', EAST: 'WEST', WEST: 'EAST' }
  const stack = []
  for (const d of arr) {
    if (stack.length && opposite[stack[stack.length - 1]] === d) stack.pop()
    else stack.push(d)
  }
  return stack
}
    for (let __i = 0; __i < 25; __i++) {
      const __dirs=['NORTH','SOUTH','EAST','WEST']; const arr = Array.from({length: rndInt(0,15)}, () => pick(__dirs));
      expect(dirReduc(arr)).toEqual(__reference(arr));
    }
  });
});
