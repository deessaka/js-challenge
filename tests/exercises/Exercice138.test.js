// Fixed-only: the exact enumeration order for this exercise is intricate (subsequence
// search producing a specific canonical ordering) and only one worked example exists in
// the source spec. Rather than risk re-deriving the ordering algorithm incorrectly, this
// uses the literal example given, which is unambiguous and verifiable as-is.
describe('Exercice 138', () => {
  it('cas fixe', () => {
    expect(banana('bbananana')).toEqual([
      'b-anana--',
      'b-anan--a',
      'b-ana--na',
      'b-an--ana',
      'b-a--nana',
      'b---anana',
      '-banana--',
      '-banan--a',
      '-bana--na',
      '-ban--ana',
      '-ba--nana',
      '-b--anana',
    ]);
  });
});
