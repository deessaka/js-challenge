// Exercice Exercice101
//
const toWeirdCase = require("../exercices/Exercice101");

describe("Exercice 101", () => {
  it("should return the correct string", () => {
    expect(toWeirdCase("String")).toEqual("StRiNg");
    expect(toWeirdCase("Weird string case")).toEqual("WeIrD StRiNg CaSe");
  });
});

