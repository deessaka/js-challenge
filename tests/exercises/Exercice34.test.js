// Exercice Exercice34

const countCorrectCharacters = require("../Exercice34");

describe("countCorrectCharacters", () => {
  it("should return the number of correct characters", () => {
    expect(countCorrectCharacters("dog", "car")).toBe(0);
    expect(countCorrectCharacters("dog", "god")).toBe(1);
    expect(countCorrectCharacters("dog", "cog")).toBe(2);
    expect(countCorrectCharacters("dog", "cod")).toBe(1);
    expect(countCorrectCharacters("dog", "bog")).toBe(2);
    expect(countCorrectCharacters("dog", "dog")).toBe(3);
  });
});

