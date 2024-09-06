// Exercice Exercice38
//
const tennisGamePoints = require("../Exercice38");

describe("tennisGamePoints", () => {
  it("should return the number of points for the given game", () => {
    expect(tennisGamePoints("15-40")).toBe(4);
    expect(tennisGamePoints("30-all")).toBe(4);
    expect(tennisGamePoints("love-30")).toBe(2);
    expect(tennisGamePoints("15-30")).toBe(3);
    expect(tennisGamePoints("30-all")).toBe(4);
  });
});

