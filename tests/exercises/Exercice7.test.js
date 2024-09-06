// Exercice Exercice7

const whoseMove = require("../exercices/Exercice7");

describe("Exercice 7", () => {
  it("joueur suivant", () => {
    expect(whoseMove("black", false)).toBe("white");
    expect(whoseMove("white", true)).toBe("white");
    expect(whoseMove("white", false)).toBe("black");
  });
});

