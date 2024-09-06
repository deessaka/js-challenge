// Exercice Exercice21

const maskify = require("../exercices/Exercice21");

describe("Exercice 21", () => {
  it("maskify", () => {
    expect(maskify("4556364607935616")).toEqual("############5616");
    expect(maskify("1")).toEqual("1");
    expect(maskify("11111")).toEqual("#1111");
  });
});

