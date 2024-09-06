// Exercice Exercice39

const comesAfter = require("../Exercice39");

describe("comesAfter", () => {
  it("should return the letter after the given letter", () => {
    expect(comesAfter("Pirates say arrrrrrrrr.", "r")).toBe("arrrrrrrr");
    expect(comesAfter("Free coffee for all office workers!", "F")).toBe(
      "rfeofi",
    );
    expect(
      comesAfter("king kUnta is the sickest rap song ever kNown k!", "k"),
    ).toBe("iUeN");
    expect(comesAfter("p8tice makes pottery p0rfect!", "p")).toBe("o");
    expect(comesAfter("d8u d._ rly 2d1s", "D")).toBe("");
    expect(comesAfter("nothing to be found here", "z")).toBe("");
  });
});

