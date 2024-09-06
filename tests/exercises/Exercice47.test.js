// Exercice Exercice47
//
const gimme = require("../Exercice47");

describe("gimme", () => {
  it("should return the middle", () => {
    expect(gimme([2, 3, 1])).toEqual(0);
    expect(gimme([5, 10, 14])).toEqual(1);
    expect(gimme([5, 10, 14, 15])).toEqual(1);
    expect(gimme([5, 10, 14, 15, 16])).toEqual(2);
  });
});

