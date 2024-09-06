// Exercice Exercice32

const coolString = require("../exercices/Exercice32");

describe("Exercice 32", () => {
  it("should return true if the string is cool", () => {
    expect(coolString("aAaAaAa")).toEqual(true);
    expect(coolString("tTzXmLkG")).toEqual(true);
    expect(coolString("976")).toEqual(false);
    expect(coolString("aBC")).toEqual(false);
  });
});

