function __tickFor(str) { let prog=''; for (let i=0;i<str.length;i++) { if (i>0) prog+='>'; prog += '+'.repeat(str.charCodeAt(i)) + '*'; } return prog; }
describe('Exercice 114', () => {
  it("cas fixe 1", () => {
    expect(interpreter(__tickFor('AB'))).toBe("AB");
  });
  it("tests aléatoires (chaînes encodées)", () => {
    function __reference(program) {
  const tape = new Map()
  let ptr = 0
  let output = ''
  for (const ch of program) {
    if (ch === '>') ptr++
    else if (ch === '<') ptr--
    else if (ch === '+') tape.set(ptr, ((tape.get(ptr) || 0) + 1) % 256)
    else if (ch === '*') output += String.fromCharCode(tape.get(ptr) || 0)
  }
  return output
}
    for (let __i = 0; __i < 20; __i++) {
      const __chars='abcXYZ01 !'; const __len=rndInt(1,4); let __s=''; for(let __k=0;__k<__len;__k++) __s+=pick(__chars.split('')); const program = __tickFor(__s);
      expect(interpreter(program)).toEqual(__reference(program));
    }
  });
});
