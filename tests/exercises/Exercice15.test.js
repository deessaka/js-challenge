// Exercice Exercice15

const counterEffect = require("../exercices/Exercice15");

describe("Exercice 15", () => {
  it("counterEffect", () => {
    expect(counterEffect("1250")).toEqual([
      [0, 1],
      [0, 1, 2],
      [0, 1, 2, 3, 4, 5],
      [0],
    ]);
    expect(counterEffect("0050")).toEqual([[0], [0], [0, 1, 2, 3, 4, 5], [0]]);
    expect(counterEffect("0000")).toEqual([[0], [0], [0], [0]]);
  });
});

