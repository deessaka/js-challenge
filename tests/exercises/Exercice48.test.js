// Exercice Exercice48
//
const runYourString = require("../Exercice48");

describe("runYourString", () => {
  it("should return the result of the function", () => {
    expect(
      runYourString(4, {
        param: "num",
        func: "return Math.sqrt(num)",
      }),
    ).toEqual(2);
    expect(
      runYourString(10, {
        param: "a",
        func: "return a === 10",
      }),
    ).toEqual(true);
    expect(
      runYourString(123, {
        param: "radius",
        func: "return (radius > 0) ? Math.round((Math.PI * Math.pow(radius, 2))*100)/100 : false;",
      }),
    ).toEqual(47529.16);
  });
});

