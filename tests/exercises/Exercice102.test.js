// Exercice Exercice102
//
const unlock = require("../exercices/Exercice102");

describe("Exercice 102", () => {
  it("should return the correct number", () => {
    expect(unlock("Nokia")).toEqual(66542);
    expect(unlock("Voiture")).toEqual(8648873);
    expect(unlock("Porte")).toEqual(76783);
  });
});

