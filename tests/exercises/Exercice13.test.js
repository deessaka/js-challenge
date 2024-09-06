// Exercice Exercice13

const getCount = require("../exercices/Exercice13");

describe("Exercice 13", () => {
  it("getCount", () => {
    expect(getCount("Ceci est une phrase")).toBe(7);
  });
});

