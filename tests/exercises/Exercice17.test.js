// Exercice Exercice17

const findShort = require("../exercices/Exercice17");

describe("Exercice 17", () => {
  it("findShort", () => {
    expect(
      findShort("bitcoin take over the world maybe who knows perhaps"),
    ).toEqual(3);
  });
});

