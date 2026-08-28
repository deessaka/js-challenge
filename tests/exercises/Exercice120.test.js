describe('Exercice 120', () => {
  it("cas fixe 1", () => {
    expect(pigLatin("Pig latin is cool")).toBe("igPay atinlay siay oolcay");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(str) {
  return str.split(' ').map((w) => w.slice(1) + w[0] + 'ay').join(' ')
}
    for (let __i = 0; __i < 20; __i++) {
      const __words = ['pig','latin','is','cool','hello','world','javascript','test','kata','code']; const str = Array.from({length: rndInt(1,5)}, () => pick(__words)).join(' ');
      expect(pigLatin(str)).toEqual(__reference(str));
    }
  });
});
