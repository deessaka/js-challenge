// Exercice Exercice37

const lostSheep = require("../Exercice37");

describe("lostSheep", () => {
  it("should return the number of lost sheep", () => {
    expect(lostSheep([1, 2], [3, 4], 15)).toBe(5);
    expect(lostSheep([3, 1, 2], [4, 5], 21)).toBe(6);
    expect(lostSheep([5, 1, 4], [5, 4], 29)).toBe(10);
    expect(lostSheep([11, 23, 3, 4, 15], [7, 14, 9, 21, 15], 300)).toBe(178);
  });
});

