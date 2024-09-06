// Exercice Exercice99
//
const findChildren = require("../exercices/Exercice99");

describe("Exercice 99", () => {
  it("should return the correct string", () => {
    expect(findChildren("aAbaBb")).toEqual("AaaBbb");
    expect(findChildren("beeeEBb"));
    expect(findChildren("uwwWUeEe"));
  });
});

