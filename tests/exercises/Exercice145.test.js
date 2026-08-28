describe('Exercice 145', () => {
  it("cas fixe 1", () => {
    expect(solution([-6,-3,-2,-1,0,1,3,4,5,7,8,9,10,11,14,15,17,18,19,20])).toBe("-6,-3-1,3-5,7-11,14,15,17-20");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(list) {
  const parts = []
  let i = 0
  while (i < list.length) {
    let j = i
    while (j + 1 < list.length && list[j + 1] === list[j] + 1) j++
    if (j - i >= 2) parts.push(`${list[i]}-${list[j]}`)
    else for (let k = i; k <= j; k++) parts.push(String(list[k]))
    i = j + 1
  }
  return parts.join(',')
}
    for (let __i = 0; __i < 25; __i++) {
      let __n = rndInt(-10,10); const list=[]; for (let __k=0;__k<rndInt(1,15);__k++) { list.push(__n); __n += pick([1,1,1,rndInt(2,5)]); }
      expect(solution(list)).toEqual(__reference(list));
    }
  });
});
