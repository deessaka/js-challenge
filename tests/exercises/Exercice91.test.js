// Exercice Exercice91
//
const tribonacci = require("../exercices/Exercice91");

describe("Exercice91: tribonacci", () => {
  it("should return [1,1,1,3,5,9,17,31,57,105] for [1,1,1],10", () => {
    expect(tribonacci([1, 1, 1], 10)).toEqual([
      1, 1, 1, 3, 5, 9, 17, 31, 57, 105,
    ]);
  });
  it("should return [0,0,1,1,2,4,7,13,24,44] for [0,0,1],10", () => {
    expect(tribonacci([0, 0, 1], 10)).toEqual([
      0, 0, 1, 1, 2, 4, 7, 13, 24, 44,
    ]);
  });
  it("should return [0,1,1,2,4,7,13,24,44,81] for [0,1,1],10", () => {
    expect(tribonacci([0, 1, 1], 10)).toEqual([
      0, 1, 1, 2, 4, 7, 13, 24, 44, 81,
    ]);
  });
  it("should return [1,0,0,1,1,2,4,7,13,24] for [1,0,0],10", () => {
    expect(tribonacci([1, 0, 0], 10)).toEqual([1, 0, 0, 1, 1, 2, 4, 7, 13, 24]);
  });
});

