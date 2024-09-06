// Exercice Exercice72
//
const { divisibleBySix } = require("../exercices/Exercice72");

describe("Exercice 72", () => {
  it("should return ['120', '150', '180'] for '1*0'", () => {
    expect(divisibleBySix("1*0")).toEqual(["120", "150", "180"]);
  });

  it("should return [] for '*1'", () => {
    expect(divisibleBySix("*1")).toEqual([]);
  });

  it("should return ['123456789012345678901234567800', '123456789012345678901234567830', '123456789012345678901234567860'] for '1234567890123456789012345678*0'", () => {
    expect(divisibleBySix("1234567890123456789012345678*0")).toEqual([
      "123456789012345678901234567800",
      "123456789012345678901234567830",
      "123456789012345678901234567860",
    ]);
  });
});

