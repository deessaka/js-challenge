// Exercice Exercice109
const removeDuplicates = require("../exercices/Exercice109");

describe("Exercice 109", () => {
  it("should return the correct result", () => {
    const result = removeDuplicates([20, 37, 20, 21], 1);
    expect(result).toEqual([20, 37, 21]);
  });

  it("should return the correct result", () => {
    const result = removeDuplicates([1, 1, 3, 3, 7, 2, 2, 2, 2], 3);
    expect(result).toEqual([1, 1, 3, 3, 7, 2, 2, 2]);
  });

  it("should return the correct result", () => {
    const result = removeDuplicates(
      [1, 2, 3, 1, 1, 2, 1, 2, 3, 3, 2, 4, 5, 3, 1],
      3,
    );
    expect(result).toEqual([1, 2, 3, 1, 1, 2, 2, 3, 3, 4, 5]);
  });
});

