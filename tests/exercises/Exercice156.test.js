describe('Exercice 156', () => {
  it('cas fixes', () => {
    expect(multipleOf3Regex.test('11')).toBe(true);
    expect(multipleOf3Regex.test((372).toString(2))).toBe(true);
    expect(multipleOf3Regex.test((7).toString(2))).toBe(false);
  });

  it('tests aléatoires vs vérification arithmétique directe', () => {
    for (let __i = 0; __i < 40; __i++) {
      const n = rndInt(0, 5000);
      const bin = n.toString(2);
      expect(multipleOf3Regex.test(bin)).toBe(n % 3 === 0);
    }
  });
});
