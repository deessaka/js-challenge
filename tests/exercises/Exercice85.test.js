// Exercice Exercice85
//

const { superposition } = require("../exercices/Exercice85");

describe("Exercice 85: superposition", () => {
  it("should return 2 for [8, 4, 6, 1] and [10, 9, 7, 2]", () => {
    expect(superposition([8, 4, 6, 1], [10, 9, 7, 2])).toBe(2);
  });
  it("should return 1 for [1, 2] and [3, 4]", () => {
    expect(superposition([1, 2], [3, 4])).toBe(1);
  });
  it("should return 1 for [1, 2] and [2, 4]", () => {
    expect(superposition([1, 2], [2, 4])).toBe(1);
  });
});

