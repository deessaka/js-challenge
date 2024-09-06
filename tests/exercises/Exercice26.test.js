// Exercice Exercice26

const vampireTest = require("../exercices/Exercice26");

describe("Exercice 26", () => {
  it("should return true if the given number is a vampire", () => {
    expect(vampireTest(21, 6)).toBe(true);
    expect(vampireTest(204, 615)).toBe(true);
    expect(vampireTest(30, -51)).toBe(true);
    expect(vampireTest(-246, -510)).toBe(false);
    expect(vampireTest(2947050, 8469153)).toBe(true);
  });
});

