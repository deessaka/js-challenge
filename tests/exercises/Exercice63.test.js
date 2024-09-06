// Exercice Exercice63
//
const { solvePostfix } = require("../exercices/Exercice63");

describe("Exercice 63", () => {
  it("should return 5 for '2 3 +'", () => {
    expect(solvePostfix("2 3 +")).toBe(5);
  });

  it("should return -6 for '2 8 -'", () => {
    expect(solvePostfix("2 8 -")).toBe(-6);
  });

  it("should return 2 for '4 2 /'", () => {
    expect(solvePostfix("4 2 /")).toBe(2);
  });

  it("should return 719 for '10 5 / 7 + 3 ^ 10 -'", () => {
    expect(solvePostfix("10 5 / 7 + 3 ^ 10 -")).toBe(719);
  });

  it("should return 89 for '8 3 4 ^ +'", () => {
    expect(solvePostfix("8 3 4 ^ +")).toBe(89);
  });
});

