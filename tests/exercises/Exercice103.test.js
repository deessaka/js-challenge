// Exercice Exercice103
const randomSub = require("../exercices/Exercice103");

describe("Exercice 103", () => {
  it("should return the correct object", () => {
    const result = randomSub();

    // Ensure result is an object
    expect(typeof result).toBe("object");

    // Extract keys and values
    const keys = Object.keys(result);
    const values = Object.values(result);

    // Expect keys to be lowercase letters in alphabetical order
    expect(keys).toEqual([
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z",
    ]);

    // Expect values to be lowercase letters (may not be unique or in order)
    values.forEach((value) => {
      expect(/[a-z]/.test(value)).toBe(true);
    });

    // Log result
    console.log(result);
  });
});

