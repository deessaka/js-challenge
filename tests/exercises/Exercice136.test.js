// Fixed-only: the simulation rules (eating order, stability halt condition, output
// format) are intricate; only 3 worked examples exist in the source spec. Using them
// verbatim avoids risking an incorrect re-derivation of the simulation algorithm.
describe('Exercice 136', () => {
  it('cas fixe 1', () => {
    expect(whoEatsWho('fox,bug,chicken,grass,sheep')).toEqual([
      'fox,bug,chicken,grass,sheep',
      'chicken eats bug',
      'fox eats chicken',
      'sheep eats grass',
      'fox eats sheep',
      'fox',
    ]);
  });

  it('cas fixe 2', () => {
    expect(whoEatsWho('fox,panda,grass,bear,cow,chicken,antelope,little-fish,fox,sheep')).toEqual([
      'bear eats cow',
      'bear eats chicken',
      'fox eats sheep',
      'fox,panda,grass, bear, antelope,little-fish,fox',
    ]);
  });

  it('cas fixe 3', () => {
    expect(whoEatsWho('fox,chicken,tree,chicken,bug,banana,bug,bear')).toEqual([
      'fox,chicken,tree,chicken,bug,banana,bug,bear',
      'fox eats chicken',
      'chicken eats bug',
      'bear eats bug',
      'fox,tree,chicken,banana,bear',
    ]);
  });
});
