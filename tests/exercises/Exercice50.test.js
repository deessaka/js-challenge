// Exercice Exercice50
//
const elimination = require("../Exercice50");

describe("elimination", () => {
  it("should return the eliminated number", () => {
    expect(elimination([2, 5, 34, 1, 22, 1])).toEqual(1);
    expect(elimination([2, 2, 34, 1, 22])).toEqual(2);
    expect(elimination([2, 5, 34, 1, 22])).toEqual(null);
  });
});

