describe('Exercice 154', () => {
  it("cas fixe 1", () => {
    expect(mix("my&friend&Paul has heavy hats! &", "my friend John has many many friends &")).toBe("2:nnnnn/1:aaaa/1:hhh/2:mmm/2:yyy/2:dd/2:ff/2:ii/2:rr/=:ee/=:ss");
  });
  it("cas fixe 2", () => {
    expect(mix("mmmmm m nnnnn y&friend&Paul has heavy hats! &", "my frie n d Joh n has ma n y ma n y frie n ds n&")).toBe("1:mmmmmm/=:nnnnnn/1:aaaa/1:hhh/2:yyy/2:dd/2:ff/2:ii/2:rr/=:ee/=:ss");
  });
  it("cas fixe 3", () => {
    expect(mix("Are the kids at home? aaaaa fffff", "Yes they are here! aaaaa fffff")).toBe("=:aaaaaa/2:eeeee/=:fffff/1:tt/2:rr/=:hh");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(s1, s2) {
  const count1 = {}, count2 = {}
  for (const c of s1) if (c >= 'a' && c <= 'z') count1[c] = (count1[c] || 0) + 1
  for (const c of s2) if (c >= 'a' && c <= 'z') count2[c] = (count2[c] || 0) + 1
  const letters = new Set([...Object.keys(count1), ...Object.keys(count2)])
  const groups = []
  for (const c of letters) {
    const n1 = count1[c] || 0, n2 = count2[c] || 0
    const max = Math.max(n1, n2)
    if (max <= 1) continue
    const prefix = n1 > n2 ? '1' : n2 > n1 ? '2' : '='
    groups.push(`${prefix}:${c.repeat(max)}`)
  }
  groups.sort((a, b) => (a.length !== b.length ? b.length - a.length : a < b ? -1 : a > b ? 1 : 0))
  return groups.join('/')
}
    for (let __i = 0; __i < 20; __i++) {
      const __letters='abcdef'.split(''); const s1 = Array.from({length: rndInt(5,20)}, () => pick(__letters)).join(''); const s2 = Array.from({length: rndInt(5,20)}, () => pick(__letters)).join('');
      expect(mix(s1, s2)).toEqual(__reference(s1, s2));
    }
  });
});
