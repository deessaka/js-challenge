// Exercice Exercice4

const stringClean = require("../exercices/Exercice4");

describe("Exercice 4", () => {
  it("Nous devons supprimer tous les caractères numériques d'une chaîne", () => {
    expect(stringClean("! !")).toBe("! !");
    expect(stringClean("123456789")).toBe("");
    expect(stringClean("(E3at m2e2!!)")).toBe("(Eat me!!)");
    expect(
      stringClean("Wh7y can't we3 bu1y the goo0d software3? #cheapskates3"),
    ).toBe("Why can't we buy the good software? #cheapskates");
  });
});

