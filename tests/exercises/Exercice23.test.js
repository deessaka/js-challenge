// Exercice Exercice23

const highAndLow = require("../exercices/Exercice23");

describe("Exercice 23", () => {
  it("should return the highest and lowest numbers", () => {
    expect(highAndLow("1 2 3 4 5")).toBe("5 1");
    expect(highAndLow("1 2 -3 4 5")).toBe("5 -3");
    expect(highAndLow("1 9 3 4 -5")).toBe("9 -5");
  });
});

