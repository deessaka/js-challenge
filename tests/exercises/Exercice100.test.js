// Exercice Exercice100
//
const suffixSums = require("../exercices/Exercice100");

describe("Exercice 100", () => {
  it("should return the correct array", () => {
    expect(suffixSums([1, 2, 3])).toEqual([6, 5, 3]);
    expect(suffixSums([1, 2, 3, -6])).toEqual([0, -1, -3, -6]);
    expect(suffixSums([0, 0, 0])).toEqual([0, 0, 0]);
    expect(suffixSums([1, 123, 23])).toEqual([147, 146, 23]);
  });
});

