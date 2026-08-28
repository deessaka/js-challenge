describe('Exercice 125', () => {
  it("cas fixe 1", () => {
    expect(orderWeight("103 123 4444 99 2000")).toBe("2000 103 123 4444 99");
  });
  it("cas fixe 2", () => {
    expect(orderWeight("2000 10003 1234000 44444444 9999 11 11 22 123")).toBe("11 11 2000 10003 22 123 1234000 44444444 9999");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  const digitSum = (s) => s.split('').reduce((a, d) => a + Number(d), 0)
  return str.split(' ').sort((a, b) => digitSum(a) - digitSum(b) || (a < b ? -1 : a > b ? 1 : 0)).join(' ')
}
    for (let __i = 0; __i < 20; __i++) {
      const str = Array.from({length: rndInt(2,8)}, () => String(rndInt(1,999999))).join(' ');
      expect(orderWeight(str)).toEqual(__reference(str));
    }
  });
});
