// Exercice Exercice53
//
const totalBill = require("../Exercice53");

describe("totalBill", () => {
  it("should return the bill", () => {
    expect(totalBill("rr")).toEqual(4);
    expect(totalBill("rr rrr")).toEqual(8);
    expect(totalBill("rr rrr rrr rr")).toEqual(16);
    expect(totalBill("rrrrrrrrrrrrrrrrrr   rr r")).toEqual(34);
    expect(totalBill("")).toEqual(0);
  });
});

