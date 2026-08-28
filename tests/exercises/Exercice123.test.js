describe('Exercice 123', () => {
  it("cas fixe 1", () => {
    expect(productFib(714)).toEqual([21,34,true]);
  });
  it("cas fixe 2", () => {
    expect(productFib(800)).toEqual([34,55,false]);
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(prod) {
  let a = 0, b = 1
  while (a * b < prod) { const t = a + b; a = b; b = t }
  return [a, b, a * b === prod]
}
    for (let __i = 0; __i < 25; __i++) {
      const prod = rndInt(0, 5000);
      expect(productFib(prod)).toEqual(__reference(prod));
    }
  });
});
