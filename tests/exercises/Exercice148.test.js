describe('Exercice 148', () => {
  it("cas fixe 1", () => {
    expect(simplify("dc+dcba")).toBe("cd+abcd");
  });
  it("cas fixe 2", () => {
    expect(simplify("2xy-yx")).toBe("xy");
  });
  it("cas fixe 3", () => {
    expect(simplify("-a+5ab+3a-c-2a")).toBe("-c+5ab");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(poly) {
  poly = poly.replace(/\s+/g, '')
  const termRe = /([+-]?)(\d*)([a-z]+)/g
  const totals = {}
  let m
  while ((m = termRe.exec(poly))) {
    const [, sign, coefStr, varsStr] = m
    let coef = coefStr === '' ? 1 : parseInt(coefStr, 10)
    if (sign === '-') coef = -coef
    const key = varsStr.split('').sort().join('')
    totals[key] = (totals[key] || 0) + coef
  }
  const terms = Object.entries(totals).filter(([, c]) => c !== 0)
  terms.sort((a, b) => (a[0].length !== b[0].length ? a[0].length - b[0].length : a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))
  let result = ''
  terms.forEach(([key, coef], idx) => {
    const absCoef = Math.abs(coef)
    const coefPart = absCoef === 1 ? '' : String(absCoef)
    result += (idx === 0 ? (coef < 0 ? '-' : '') : (coef < 0 ? '-' : '+')) + coefPart + key
  })
  return result
}
    for (let __i = 0; __i < 15; __i++) {
      const __vars='abcd'.split(''); let poly=''; const __nTerms=rndInt(2,4); for(let __t=0; __t<__nTerms; __t++){ const __coef=rndInt(1,5); const __nv=rndInt(1,3); const __shuffled=shuffle(__vars).slice(0,__nv).join(''); const __sign=pick(['+','-']); poly += (__t===0 && __sign==='+' ? '' : __sign) + (__coef===1?'':String(__coef)) + __shuffled; }
      expect(simplify(poly)).toEqual(__reference(poly));
    }
  });
});
