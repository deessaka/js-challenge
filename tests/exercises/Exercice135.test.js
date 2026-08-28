describe('Exercice 135', () => {
  it("cas fixe 1", () => {
    expect(roadKill("==========h===yyyyyy===eeee=n==a========")).toBe("hyena");
  });
  it("cas fixe 2", () => {
    expect(roadKill("======pe====nnnnnn=================n=n=ng====u==iiii=iii==nn=============n=")).toBe("penguin");
  });
  it("tests aléatoires vs solution de référence", () => {
    function __reference(photo) {
  return photo.replace(/=/g, '').replace(/(.)\1+/g, '$1')
}
    for (let __i = 0; __i < 20; __i++) {
      const __animals=['hyena','penguin','bear','tiger','zebra','koala','camel']; const __name = pick(__animals); let photo=''; for (const ch of __name) { photo += '='.repeat(rndInt(1,4)) + ch.repeat(rndInt(1,6)); } photo += '='.repeat(rndInt(1,4));
      expect(roadKill(photo)).toEqual(__reference(photo));
    }
  });
});
