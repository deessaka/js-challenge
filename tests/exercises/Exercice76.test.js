// Exercice Exercice76
//
const { alphabetPosition } = require("../exercices/Exercice76");

describe("Exercice 76", () => {
  it("should return '20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11' for 'The sunset sets at twelve o' clock.'", () => {
    expect(alphabetPosition("The sunset sets at twelve o' clock.")).toBe(
      "20 8 5 19 21 14 19 5 20 19 5 20 19 1 20 20 23 5 12 22 5 15 3 12 15 3 11",
    );
  });
});

