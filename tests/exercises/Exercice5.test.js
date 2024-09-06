// Exercice Exercice5

const doubleChar = require("../exercices/Exercice5");

describe("Exercice 5", () => {
  it("doubler les lettres", () => {
    expect(doubleChar("String")).toBe("SSttrriinngg");
    expect(doubleChar("Hello World")).toBe("HHeelllloo  WWoorrlldd");
    expect(doubleChar("1234!_ ")).toBe("11223344!!__  ");
  });
});

