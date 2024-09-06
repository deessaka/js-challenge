// Exercice Exercice12

const toJadenCase = require("../exercices/Exercice12");

describe("Exercice 12", () => {
  it("toJadenCase", () => {
    expect("Ceci est une phrase".toJadenCase()).toBe("Ceci Est Une Phrase");
  });
});

