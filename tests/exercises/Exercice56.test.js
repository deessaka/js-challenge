// Exercice Exercice56

const { countBits } = require("../exercices/Exercice56");

describe("Exercice 56", () => {
  it("should return 0 for 0", () => {
    expect(countBits(0)).toBe(0);
  });

  it("should return 1 for 4", () => {
    expect(countBits(4)).toBe(1);
  });

  it("should return 3 for 7", () => {
    expect(countBits(7)).toBe(3);
  });
});

